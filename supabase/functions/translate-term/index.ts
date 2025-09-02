import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  slug: string;
  lang: 'ar' | 'fa';
}

const languageNames = {
  ar: 'Arabic',
  fa: 'Persian (Farsi)'
};

const languagePrompts = {
  ar: `Translate to Modern Standard Arabic (العربية الفصحى) for teenagers and young adults.
Use clear, educational language appropriate for 13-18 year olds.
Focus on leadership, psychology, and personal development terminology.`,
  fa: `Translate to Persian/Farsi (فارسی) for teenagers and young adults.
Use clear, educational language appropriate for 13-18 year olds.
Focus on leadership, psychology, and personal development terminology.`
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
      return new Response(JSON.stringify({ error: 'Translation service unavailable' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { slug, lang }: TranslateRequest = await req.json();

    console.log(`Translation request: ${slug} -> ${lang}`);

    // Get the term from database
    const { data: term, error: termError } = await supabase
      .from('dictionary')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (termError || !term) {
      return new Response(JSON.stringify({ error: 'Term not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if translation already exists and is recent (less than 180 days old)
    const existingTranslations = term.translations || {};
    const existingTranslation = existingTranslations[lang];
    
    if (existingTranslation && existingTranslation.updatedAt) {
      const translationAge = Date.now() - new Date(existingTranslation.updatedAt).getTime();
      const maxAge = 180 * 24 * 60 * 60 * 1000; // 180 days in milliseconds
      
      if (translationAge < maxAge) {
        console.log(`Using cached translation for ${slug} -> ${lang}`);
        return new Response(JSON.stringify({
          term: existingTranslation.term,
          shortDef: existingTranslation.shortDef,
          source: existingTranslation.source || 'ai',
          cached: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate new translation
    console.log(`Generating new translation for ${slug} -> ${lang}`);
    
    const text = `${term.term}\n---\n${term.short_def || term.long_def || 'Educational term in teenager management and leadership.'}`;
    
    const prompt = `${languagePrompts[lang]}

Translate the following TERM and its SHORT DEFINITION for teenagers.
Keep the definition clear, neutral, and 1–2 sentences maximum.
Ensure the terminology is appropriate for educational contexts.

Return ONLY valid JSON in this exact format:
{"term":"translated term","shortDef":"translated definition"}

Text to translate:
${text}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational translator specializing in teenager leadership and psychology terms. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No translation content received');
    }

    let translation;
    try {
      translation = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse translation response:', content);
      throw new Error('Invalid translation format received');
    }

    // Update the term with new translation
    const updatedTranslations = {
      ...existingTranslations,
      [lang]: {
        term: translation.term,
        shortDef: translation.shortDef,
        updatedAt: new Date().toISOString(),
        source: 'ai'
      }
    };

    const { error: updateError } = await supabase
      .from('dictionary')
      .update({ 
        translations: updatedTranslations,
        translation_updated_at: new Date().toISOString()
      })
      .eq('id', term.id);

    if (updateError) {
      console.error('Failed to cache translation:', updateError);
      // Still return the translation even if caching failed
    }

    // Log analytics
    await supabase.from('dictionary_analytics').insert({
      term_id: term.id,
      event_type: 'translation_generated',
      metadata: {
        language: lang,
        source: 'ai',
        cached: false
      }
    });

    console.log(`Translation complete: ${slug} -> ${lang}`);

    return new Response(JSON.stringify({
      term: translation.term,
      shortDef: translation.shortDef,
      source: 'ai',
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in translate-term function:', error);
    
    // Return 502 for client fallback as specified
    return new Response(JSON.stringify({ 
      error: 'Translation failed',
      message: error.message 
    }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});