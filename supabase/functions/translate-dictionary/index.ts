import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  termId?: string;
  translateAll?: boolean;
}

const supportedLanguages = {
  ar: { name: 'Arabic', nativeName: 'العربية' },
  fa: { name: 'Persian', nativeName: 'فارسی' },
  es: { name: 'Spanish', nativeName: 'Español' },
  fr: { name: 'French', nativeName: 'Français' },
  de: { name: 'German', nativeName: 'Deutsch' },
  tr: { name: 'Turkish', nativeName: 'Türkçe' },
  ur: { name: 'Urdu', nativeName: 'اردو' }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { termId, translateAll }: TranslationRequest = await req.json();

    console.log('Translation request:', { termId, translateAll });

    let termsToTranslate;
    
    if (translateAll) {
      // Get all published terms that need translations
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('status', 'published');
      
      if (error) throw error;
      termsToTranslate = data || [];
    } else if (termId) {
      // Get specific term
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('id', termId)
        .single();
      
      if (error) throw error;
      termsToTranslate = [data];
    } else {
      throw new Error('Either termId or translateAll must be provided');
    }

    let translated = 0;
    let skipped = 0;
    let errors = 0;

    for (const term of termsToTranslate) {
      try {
        console.log(`Translating term: ${term.term}`);
        
        // Check which languages need translation
        const existingTranslations = term.translations || {};
        const languagesToTranslate = Object.keys(supportedLanguages).filter(
          lang => !existingTranslations[lang]
        );

        if (languagesToTranslate.length === 0) {
          console.log(`Term "${term.term}" already has all translations`);
          skipped++;
          continue;
        }

        // Generate translations for missing languages
        const newTranslations = { ...existingTranslations };

        for (const langCode of languagesToTranslate) {
          const langInfo = supportedLanguages[langCode as keyof typeof supportedLanguages];
          
          try {
            const translation = await translateTerm(
              term.term,
              term.short_def || term.long_def || 'Educational term in teenager management and leadership.',
              langCode,
              langInfo.name,
              openaiApiKey
            );

            newTranslations[langCode] = translation;
            
            // Small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error(`Failed to translate to ${langInfo.name}:`, error);
          }
        }

        // Update the term with new translations
        const { error: updateError } = await supabase
          .from('dictionary')
          .update({ translations: newTranslations })
          .eq('id', term.id);

        if (updateError) {
          throw updateError;
        }

        translated++;
        console.log(`Successfully translated term: ${term.term}`);

      } catch (error) {
        console.error(`Failed to translate term "${term.term}":`, error);
        errors++;
      }
    }

    // Log analytics
    await supabase.from('dictionary_analytics').insert({
      event_type: 'translation_batch_completed',
      metadata: {
        terms_processed: termsToTranslate.length,
        translated,
        skipped,
        errors,
        languages: Object.keys(supportedLanguages)
      }
    });

    console.log('Translation batch complete:', { translated, skipped, errors });

    return new Response(JSON.stringify({
      success: true,
      processed: termsToTranslate.length,
      translated,
      skipped,
      errors,
      languages: Object.keys(supportedLanguages)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in translate-dictionary function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function translateTerm(
  term: string,
  definition: string,
  targetLangCode: string,
  targetLangName: string,
  openaiApiKey: string,
  retries = 3
): Promise<{ term: string; short_def: string }> {
  const prompt = `You are a professional educational translator specializing in management, leadership, psychology, and entrepreneurship terms.

Translate the following educational term and its definition to ${targetLangName}:

Term: "${term}"
Definition: "${definition}"

Requirements:
1. Provide culturally appropriate translation that maintains educational meaning
2. Keep the definition concise but clear (under 240 characters)
3. Ensure terminology is suitable for teenagers and educators
4. For Arabic, Persian, and Urdu: use proper script and direction
5. Use academic and professional language appropriate for an encyclopedia

Respond in valid JSON format:
{
  "term": "translated term in ${targetLangName}",
  "short_def": "translated definition in ${targetLangName}"
}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Translation attempt ${attempt} for "${term}" to ${targetLangName}`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-2025-08-07',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational translator specializing in management, leadership, and psychology. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_completion_tokens: 350
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error (attempt ${attempt}):`, response.status, errorText);
        
        if (attempt === retries) {
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        console.error(`No content received (attempt ${attempt})`);
        if (attempt === retries) {
          throw new Error('No translation content received after all retries');
        }
        continue;
      }

      try {
        const parsed = JSON.parse(content);
        
        // Validate the response structure
        if (!parsed.term || !parsed.short_def) {
          throw new Error('Invalid response structure');
        }
        
        console.log(`Successfully translated "${term}" to ${targetLangName}`);
        return parsed;
      } catch (parseError) {
        console.error(`Parse error (attempt ${attempt}):`, content);
        if (attempt === retries) {
          throw new Error(`Invalid translation format received: ${content}`);
        }
      }
      
    } catch (error) {
      console.error(`Translation error (attempt ${attempt}):`, error);
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  
  throw new Error('Translation failed after all retries');
}