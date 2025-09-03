import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkImportRequest {
  csvData: string;
  filename: string;
  overwriteExisting?: boolean;
}

interface LexiconTerm {
  term: string;
  slug: string;
  short_def: string;
  long_def?: string;
  category: string;
  discipline_tags: string[];
  examples?: string[];
  synonyms?: string[];
  related?: string[];
  phonetic_en?: string;
  complexity_level?: string;
  difficulty_score?: number;
  age_appropriateness?: string;
}

function generateSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseCSVRow(row: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseArrayField(value: string): string[] {
  if (!value || value.trim() === '') return [];
  
  // Handle JSON array format
  if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn('Failed to parse JSON array:', value);
    }
  }
  
  // Handle comma-separated format
  return value.split(',').map(item => item.trim()).filter(item => item !== '');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request
    const { csvData, filename, overwriteExisting = false }: BulkImportRequest = await req.json();
    
    console.log(`Starting bulk import from ${filename}`);

    // Create import record
    const { data: importRecord, error: importError } = await supabase
      .from('lexicon_imports')
      .insert({
        filename,
        import_status: 'processing'
      })
      .select()
      .single();

    if (importError) {
      throw new Error(`Failed to create import record: ${importError.message}`);
    }

    // Parse CSV data
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim());
    console.log('CSV headers:', headers);

    // Validate required headers
    const requiredHeaders = ['term', 'definition', 'category'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const terms: LexiconTerm[] = [];
    const errors: string[] = [];
    let lineNumber = 2; // Start from line 2 (after header)

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        const row = parseCSVRow(lines[i]);
        if (row.length !== headers.length) {
          errors.push(`Line ${lineNumber}: Column count mismatch`);
          lineNumber++;
          continue;
        }

        const rowData: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });

        // Skip empty rows
        if (!rowData.term || rowData.term.trim() === '') {
          lineNumber++;
          continue;
        }

        const term: LexiconTerm = {
          term: rowData.term.trim(),
          slug: generateSlug(rowData.term.trim()),
          short_def: rowData.definition || rowData.short_def || '',
          long_def: rowData.long_definition || rowData.long_def || '',
          category: rowData.category || 'General',
          discipline_tags: parseArrayField(rowData.discipline_tags || rowData.tags || ''),
          examples: parseArrayField(rowData.examples || ''),
          synonyms: parseArrayField(rowData.synonyms || ''),
          related: parseArrayField(rowData.related || ''),
          phonetic_en: rowData.phonetic || rowData.phonetic_en || '',
          complexity_level: rowData.complexity_level || 'intermediate',
          difficulty_score: parseInt(rowData.difficulty_score || '5') || 5,
          age_appropriateness: rowData.age_appropriateness || 'teenager'
        };

        // Validate term data
        if (!term.short_def && !term.long_def) {
          errors.push(`Line ${lineNumber}: Term "${term.term}" missing definition`);
          lineNumber++;
          continue;
        }

        terms.push(term);
      } catch (error) {
        errors.push(`Line ${lineNumber}: ${error.message}`);
      }
      lineNumber++;
    }

    console.log(`Parsed ${terms.length} terms, ${errors.length} errors`);

    // Update import record with parsing results
    await supabase
      .from('lexicon_imports')
      .update({
        total_terms: terms.length,
        error_log: errors
      })
      .eq('id', importRecord.id);

    if (terms.length === 0) {
      throw new Error('No valid terms found in CSV data');
    }

    // Insert terms into database
    let successCount = 0;
    let failCount = 0;
    const batchSize = 50;

    for (let i = 0; i < terms.length; i += batchSize) {
      const batch = terms.slice(i, i + batchSize);
      
      try {
        // Prepare terms for insertion
        const termsToInsert = batch.map(term => ({
          ...term,
          status: 'published',
          ai_generated: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        if (overwriteExisting) {
          // Use upsert to overwrite existing terms
          const { error: upsertError } = await supabase
            .from('dictionary')
            .upsert(termsToInsert, { onConflict: 'slug' });

          if (upsertError) {
            console.error('Batch upsert error:', upsertError);
            failCount += batch.length;
            errors.push(`Batch ${i / batchSize + 1}: ${upsertError.message}`);
          } else {
            successCount += batch.length;
          }
        } else {
          // Insert only new terms
          const { error: insertError } = await supabase
            .from('dictionary')
            .insert(termsToInsert);

          if (insertError) {
            // Handle individual term conflicts
            for (const term of termsToInsert) {
              const { error: singleError } = await supabase
                .from('dictionary')
                .insert([term]);

              if (singleError) {
                if (singleError.code === '23505') { // Unique constraint violation
                  errors.push(`Term "${term.term}" already exists (skipped)`);
                } else {
                  errors.push(`Term "${term.term}": ${singleError.message}`);
                }
                failCount++;
              } else {
                successCount++;
              }
            }
          } else {
            successCount += batch.length;
          }
        }
      } catch (error) {
        console.error('Batch processing error:', error);
        failCount += batch.length;
        errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
      }
    }

    // Update import record with final results
    await supabase
      .from('lexicon_imports')
      .update({
        successful_imports: successCount,
        failed_imports: failCount,
        import_status: successCount > 0 ? 'completed' : 'failed',
        completed_at: new Date().toISOString(),
        error_log: errors
      })
      .eq('id', importRecord.id);

    // Log analytics
    await supabase.from('dictionary_analytics').insert({
      event_type: 'bulk_import_completed',
      metadata: {
        filename,
        total_terms: terms.length,
        successful_imports: successCount,
        failed_imports: failCount,
        import_id: importRecord.id
      }
    });

    console.log(`Import completed: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        import_id: importRecord.id,
        total_processed: terms.length,
        successful_imports: successCount,
        failed_imports: failCount,
        errors: errors.slice(0, 100), // Limit error list
        message: `Successfully imported ${successCount} terms${failCount > 0 ? ` (${failCount} failed)` : ''}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Bulk import error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Import failed',
        details: 'Please check your CSV format and try again'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});