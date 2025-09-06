import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  slug: string;
  lang: 'ar' | 'fa' | 'zh' | 'hi';
}

const languageNames = {
  ar: 'Arabic',
  fa: 'Persian (Farsi)',
  zh: 'Chinese (Simplified)',
  hi: 'Hindi'
};

const languagePrompts = {
  ar: `Translate to Modern Standard Arabic (العربية الفصحى) for teenagers and young adults.
Use clear, educational language appropriate for 13-18 year olds.
Focus on leadership, psychology, and personal development terminology.`,
  fa: `Translate to Persian/Farsi (فارسی) for teenagers and young adults.
Use clear, educational language appropriate for 13-18 year olds.
Focus on leadership, psychology, and personal development terminology.`,
  zh: `Translate to Simplified Chinese (简体中文) for teenagers and young adults.
Use clear, educational language appropriate for 13-18 year olds.
Focus on leadership, psychology, and personal development terminology.`,
  hi: `Translate to Hindi (हिन्दी) for teenagers and young adults.
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

    // First check if we already have a translation cached
    const { data: existingTerm, error: fetchError } = await supabase
      .from('dictionary')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (fetchError) {
      console.error('Error fetching term:', fetchError);
      return new Response(JSON.stringify({ 
        error: 'Term not found',
        fallback: true 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const term = existingTerm;

    // Check if translation already exists
    if (term.translations && term.translations[lang]) {
      console.log(`Found cached translation for ${slug} -> ${lang}`);
      const cached = term.translations[lang];
      
      return new Response(JSON.stringify({
        term: cached.term || cached.translated_term,
        shortDef: cached.shortDef || cached.short_def,
        source: cached.source || 'ai',
        updatedAt: cached.updatedAt || cached.updated_at
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate new translation using OpenAI
    console.log(`Generating new translation for ${term.term} -> ${lang}`);

    try {
      const translationPrompt = `${languagePrompts[lang]}

Term: "${term.term}"
Definition: "${term.long_def || term.short_def}"

Respond with JSON containing:
- "term": the translated term
- "shortDef": a concise translated definition (max 150 characters)

Make sure the translation is academically accurate and appropriate for teenagers.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-mini-2025-08-07',
          messages: [
            {
              role: 'system',
              content: `You are an expert translator specializing in educational content for teenagers and young adults. Always provide translations that are culturally appropriate and educationally sound. Always respond with valid JSON only.`
            },
            {
              role: 'user',
              content: translationPrompt
            }
          ],
          response_format: { type: "json_object" },
          max_completion_tokens: 600
        }),
      });

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
        return new Response(JSON.stringify({ 
          error: 'Translation service error',
          fallback: true 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      let translationResult;

      try {
        translationResult = JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse AI response:', data.choices[0].message.content);
        return new Response(JSON.stringify({ 
          error: 'Invalid translation format',
          fallback: true 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!translationResult.term || !translationResult.shortDef) {
        console.error('Incomplete translation:', translationResult);
        return new Response(JSON.stringify({ 
          error: 'Incomplete translation',
          fallback: true 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Save the translation to the database
      const updatedTranslations = {
        ...term.translations,
        [lang]: {
          term: translationResult.term,
          shortDef: translationResult.shortDef,
          source: 'ai',
          updatedAt: new Date().toISOString()
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
        console.error('Error saving translation:', updateError);
        // Still return the translation even if we couldn't cache it
      } else {
        console.log(`Translation saved for ${term.term} -> ${lang}`);
      }

      return new Response(JSON.stringify({
        term: translationResult.term,
        shortDef: translationResult.shortDef,
        source: 'ai',
        updatedAt: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('AI Translation error:', aiError);
      return new Response(JSON.stringify({ 
        error: 'Translation generation failed',
        fallback: true 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Translate-term function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});