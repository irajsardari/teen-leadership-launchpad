import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  termSlug: string;
  targetLanguage: string;
  forceRefresh?: boolean;
}

interface SupportedLanguage {
  language_code: string;
  language_name: string;
  native_name: string;
  direction: string;
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request
    const { termSlug, targetLanguage, forceRefresh = false }: TranslateRequest = await req.json();
    
    console.log(`Translation request: ${termSlug} -> ${targetLanguage}`);

    // Validate target language
    const { data: supportedLangs, error: langError } = await supabase
      .from('supported_languages')
      .select('*')
      .eq('language_code', targetLanguage)
      .eq('is_active', true)
      .single();

    if (langError || !supportedLangs) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${targetLanguage}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the dictionary term
    const { data: term, error: termError } = await supabase
      .from('dictionary')
      .select('*')
      .eq('slug', termSlug)
      .eq('status', 'published')
      .single();

    if (termError || !term) {
      return new Response(
        JSON.stringify({ error: `Term not found: ${termSlug}` }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if translation already exists and is recent (unless force refresh)
    if (!forceRefresh && term.translations && term.translations[targetLanguage]) {
      const cachedTranslation = term.translations[targetLanguage];
      const translationAge = new Date().getTime() - new Date(cachedTranslation.updated_at || term.translation_updated_at).getTime();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      if (translationAge < maxAge) {
        console.log(`Using cached translation for ${termSlug} -> ${targetLanguage}`);
        return new Response(
          JSON.stringify({
            term: cachedTranslation.term,
            short_def: cachedTranslation.short_def || cachedTranslation.shortDef,
            source: 'cache',
            language: supportedLangs
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If English is requested, return original
    if (targetLanguage === 'en') {
      return new Response(
        JSON.stringify({
          term: term.term,
          short_def: term.short_def,
          source: 'original',
          language: supportedLangs
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new translation using OpenAI
    console.log(`Generating new translation for ${termSlug} -> ${targetLanguage}`);
    
    const prompt = `You are a professional translator specializing in educational content for teenagers. 
    
Translate the following management/leadership term into ${supportedLangs.language_name} (${supportedLangs.native_name}):

Term: "${term.term}"
Definition: "${term.short_def || term.long_def}"
Category: "${term.category}"
Discipline: "${term.discipline_tags?.join(', ') || 'General'}"

Requirements:
1. Provide an accurate translation of the term that maintains its professional meaning
2. Translate the definition to be clear and understandable for teenagers
3. Ensure cultural appropriateness and sensitivity
4. Use formal but accessible language
5. If the term has no direct translation, provide the closest equivalent with brief explanation

Respond ONLY with valid JSON in this exact format:
{
  "term": "translated term",
  "short_def": "translated definition (2-3 sentences max, teenager-friendly)"
}

Do not include any other text, explanations, or formatting.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Using reliable model for translation
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Respond only with valid JSON. No additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Low temperature for consistent translations
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`Translation API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response:', openAIData);

    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from translation API');
    }

    let translatedContent;
    try {
      translatedContent = JSON.parse(openAIData.choices[0].message.content.trim());
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', openAIData.choices[0].message.content);
      throw new Error('Invalid translation format received');
    }

    if (!translatedContent.term || !translatedContent.short_def) {
      throw new Error('Translation missing required fields');
    }

    // Update the term with new translation
    const currentTranslations = term.translations || {};
    currentTranslations[targetLanguage] = {
      term: translatedContent.term,
      short_def: translatedContent.short_def,
      source: 'ai',
      updated_at: new Date().toISOString(),
      model: 'gpt-4.1-2025-04-14'
    };

    const { error: updateError } = await supabase
      .from('dictionary')
      .update({
        translations: currentTranslations,
        translation_updated_at: new Date().toISOString(),
        ai_generated: true
      })
      .eq('id', term.id);

    if (updateError) {
      console.error('Failed to save translation:', updateError);
      // Still return the translation even if saving failed
    }

    // Log analytics
    await supabase.from('dictionary_analytics').insert({
      term_id: term.id,
      event_type: 'dynamic_translation_generated',
      metadata: {
        target_language: targetLanguage,
        model: 'gpt-4.1-2025-04-14',
        source: 'openai'
      }
    });

    console.log(`Successfully translated ${termSlug} to ${targetLanguage}`);

    return new Response(
      JSON.stringify({
        term: translatedContent.term,
        short_def: translatedContent.short_def,
        source: 'ai',
        language: supportedLangs,
        model: 'gpt-4.1-2025-04-14'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Translation failed',
        details: 'Please try again or contact support if the problem persists'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});