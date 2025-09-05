import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  termId?: string;
  termSlug?: string;
  targetLanguages?: string[];
  forceRetranslate?: boolean;
  priority?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      termId, 
      termSlug, 
      targetLanguages = ['ar', 'fa'], 
      forceRetranslate = false,
      priority = 5 
    }: TranslationRequest = await req.json();

    if (!termId && !termSlug) {
      throw new Error('Either termId or termSlug must be provided');
    }

    console.log(`Starting auto-translation for term: ${termId || termSlug}, languages: ${targetLanguages.join(', ')}`);

    // Get the term from database
    let query = supabase.from('dictionary').select('*');
    if (termId) {
      query = query.eq('id', termId);
    } else {
      query = query.eq('slug', termSlug);
    }

    const { data: term, error: fetchError } = await query.single();

    if (fetchError || !term) {
      throw new Error(`Term not found: ${termId || termSlug}`);
    }

    const results = [];
    let totalTranslated = 0;
    let totalErrors = 0;

    // Language code mapping
    const languageMap = {
      'ar': 'Arabic',
      'fa': 'Persian (Farsi)',
      'en': 'English'
    };

    for (const targetLang of targetLanguages) {
      if (!languageMap[targetLang]) {
        console.log(`Skipping unsupported language: ${targetLang}`);
        continue;
      }

      // Check if translation already exists (unless force retranslate)
      const existingKey = `definition_${targetLang}`;
      if (!forceRetranslate && term[existingKey] && term[existingKey].trim()) {
        console.log(`Translation already exists for ${targetLang}, skipping...`);
        results.push({
          language: targetLang,
          status: 'skipped',
          reason: 'already_exists',
          existing_translation: term[existingKey].substring(0, 100) + '...'
        });
        continue;
      }

      // Retry mechanism with exponential backoff
      let retryCount = 0;
      const maxRetries = 3;
      let success = false;

      while (retryCount <= maxRetries && !success) {
        try {
          const requestStartTime = Date.now();
          
          // Create translation prompt
          const systemPrompt = `You are a professional translator specializing in management and business terminology. 
          
Translate the given management term and definition from English to ${languageMap[targetLang]} with:
- Academic precision and professional terminology
- Cultural sensitivity and regional business context
- Consistent management vocabulary
- Natural, fluent expression in the target language

Return ONLY a JSON object with the translation - no additional text.`;

          const userPrompt = `Translate this management term and definition to ${languageMap[targetLang]}:

Term: "${term.term}"
Definition: "${term.definition_en || term.long_def || term.short_def}"
Example: "${term.example_en || ''}"

Return JSON format:
{
  "translated_term": "translated term in ${languageMap[targetLang]}",
  "translated_definition": "comprehensive definition in ${languageMap[targetLang]} (200-400 words)",
  "translated_example": "professional example in ${languageMap[targetLang]}",
  "phonetic": "phonetic spelling in ${targetLang === 'ar' ? 'Arabic script' : 'Latin transliteration'}"
}`;

          console.log(`Translating "${term.term}" to ${languageMap[targetLang]} (attempt ${retryCount + 1}/${maxRetries + 1})`);
          console.log(`Translation request - Prompt size: ${(systemPrompt + userPrompt).length} chars`);

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4.1-2025-04-14',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              max_completion_tokens: 2000,
            }),
          });

          const requestId = response.headers.get('x-request-id') || response.headers.get('openai-request-id') || 'unknown';
          const duration = Date.now() - requestStartTime;

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error (${response.status}): ${errorText} - Request ID: ${requestId}`);
          }

          const aiResponse = await response.json();
          const translatedContent = aiResponse.choices?.[0]?.message?.content;

          console.log(`Translation success - Request ID: ${requestId}, Duration: ${duration}ms, Tokens: ${aiResponse.usage?.total_tokens || 'unknown'}`);

          // Parse the translation
          let translation;
          try {
            translation = JSON.parse(translatedContent);
          } catch (parseError) {
            throw new Error(`Invalid translation format: ${parseError.message}`);
          }

          // Update the term in database
          const updateData = {
            [`definition_${targetLang}`]: translation.translated_definition,
            [`example_${targetLang}`]: translation.translated_example,
            [`phonetic_${targetLang}_new`]: translation.phonetic,
            translation_updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await supabase
            .from('dictionary')
            .update(updateData)
            .eq('id', term.id);

          if (updateError) {
            throw new Error(`Database update error: ${updateError.message}`);
          }

          // Log analytics
          await supabase
            .from('dictionary_analytics')
            .insert({
              term_id: term.id,
              event_type: 'auto_translation_completed',
              metadata: {
                language: targetLang,
                translation_chars: translation.translated_definition.length,
                duration_ms: duration,
                tokens_used: aiResponse.usage?.total_tokens || 0,
                request_id: requestId
              }
            });

          results.push({
            language: targetLang,
            status: 'success',
            translated_definition: translation.translated_definition,
            translated_example: translation.translated_example,
            phonetic: translation.phonetic,
            duration_ms: duration,
            tokens_used: aiResponse.usage?.total_tokens || 0,
            attempt_count: retryCount + 1
          });

          totalTranslated++;
          success = true;

          console.log(`✅ Translation completed for ${targetLang}: ${translation.translated_definition.substring(0, 100)}...`);

        } catch (error) {
          retryCount++;
          const isRetryableError = error.message?.includes('429') || 
                                   error.message?.includes('500') || 
                                   error.message?.includes('502') || 
                                   error.message?.includes('503') || 
                                   error.message?.includes('504');
          
          if (retryCount <= maxRetries && isRetryableError) {
            const backoffTime = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
            console.log(`⚠️  Retrying translation to ${targetLang} in ${backoffTime/1000}s (attempt ${retryCount}/${maxRetries}) - ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
          } else {
            totalErrors++;
            const errorInfo = {
              message: error.message || 'Unknown translation error',
              type: error.name || 'UnknownError',
              retry_count: retryCount,
              is_retryable: isRetryableError
            };
            
            results.push({
              language: targetLang,
              status: 'error',
              error: errorInfo.message,
              error_details: errorInfo,
              final_attempt: retryCount
            });
            console.error(`❌ Translation failed for ${targetLang} after ${retryCount} attempts: ${errorInfo.message}`);
            break;
          }
        }
      }

      // Rate limiting between languages
      if (success && targetLanguages.indexOf(targetLang) < targetLanguages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Auto-translation complete for "${term.term}": ${totalTranslated} success, ${totalErrors} errors`);

    return new Response(JSON.stringify({
      success: true,
      message: `Translation completed for "${term.term}"`,
      summary: {
        term_id: term.id,
        term_name: term.term,
        total_translated: totalTranslated,
        total_errors: totalErrors,
        languages_processed: targetLanguages.length,
        processing_time: new Date().toISOString()
      },
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in auto-translate-term:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: {
        type: error.name || 'UnknownError',
        stack: error.stack?.split('\n').slice(0, 3).join('\n') || 'No stack trace'
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});