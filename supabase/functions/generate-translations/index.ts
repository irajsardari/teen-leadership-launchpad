import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { termIds, languages } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`Starting batch translation for ${termIds.length} terms in languages: ${languages.join(', ')}`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process terms in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < termIds.length; i += batchSize) {
      const batch = termIds.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (termId: string) => {
        try {
          // Fetch the term
          const { data: term, error: fetchError } = await supabaseClient
            .from('dictionary')
            .select('*')
            .eq('id', termId)
            .single();

          if (fetchError || !term) {
            results.failed++;
            results.errors.push(`Failed to fetch term ${termId}: ${fetchError?.message}`);
            return;
          }

          // Get existing translations
          const existingTranslations = term.translations || {};

          // Generate translations for each requested language
          for (const lang of languages) {
            if (lang === 'en' || existingTranslations[lang]) {
              continue; // Skip English or already translated
            }

            try {
              const translationPrompt = `Translate the following educational term and definition to ${getLanguageName(lang)}. 
              This is for TMA Academy's leadership and management curriculum.
              
              Term: "${term.term}"
              Definition: "${term.long_def || term.short_def}"
              
              Provide a JSON response with:
              - "term": the translated term
              - "shortDef": a concise translated definition (max 150 characters)
              - "longDef": a detailed translated definition
              
              Ensure the translation is:
              1. Academically accurate
              2. Culturally appropriate
              3. Uses proper ${getLanguageName(lang)} terminology
              4. Maintains the educational context`;

              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${openAIApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'gpt-5-mini-2025-08-07',
                  messages: [
                    {
                      role: 'system',
                      content: `You are an expert translator specializing in educational and leadership terminology. Always respond with valid JSON only.`
                    },
                    {
                      role: 'user',
                      content: translationPrompt
                    }
                  ],
                  response_format: { type: "json_object" },
                  max_completion_tokens: 800
                }),
              });

              if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
              }

              const data = await response.json();
              const translationText = data.choices[0].message.content;

              let translation;
              try {
                translation = JSON.parse(translationText);
              } catch (parseError) {
                console.error('Failed to parse translation JSON:', translationText);
                throw new Error('Invalid translation format returned by AI');
              }

              // Validate translation structure
              if (!translation.term || !translation.shortDef) {
                throw new Error('Incomplete translation returned by AI');
              }

              // Update translations
              existingTranslations[lang] = {
                term: translation.term,
                shortDef: translation.shortDef,
                longDef: translation.longDef || translation.shortDef,
                source: 'ai',
                updatedAt: new Date().toISOString()
              };

            } catch (translationError) {
              console.error(`Translation error for ${term.term} -> ${lang}:`, translationError);
              results.errors.push(`Translation failed for ${term.term} -> ${lang}: ${translationError.message}`);
            }
          }

          // Update the term with new translations
          const { error: updateError } = await supabaseClient
            .from('dictionary')
            .update({
              translations: existingTranslations,
              translation_updated_at: new Date().toISOString()
            })
            .eq('id', termId);

          if (updateError) {
            results.failed++;
            results.errors.push(`Failed to update term ${term.term}: ${updateError.message}`);
          } else {
            results.success++;
            console.log(`Successfully translated ${term.term}`);
          }

        } catch (error) {
          results.failed++;
          results.errors.push(`Error processing term ${termId}: ${error.message}`);
        }
      }));

      // Small delay between batches to be respectful to the API
      if (i + batchSize < termIds.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Batch translation completed: ${results.success} success, ${results.failed} failed`);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-translations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: 0,
      failed: 0,
      errors: [error.message]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getLanguageName(langCode: string): string {
  const mapping = {
    'ar': 'Arabic',
    'fa': 'Persian/Farsi',
    'zh': 'Chinese (Simplified)',
    'hi': 'Hindi'
  };
  return mapping[langCode as keyof typeof mapping] || 'Unknown';
}