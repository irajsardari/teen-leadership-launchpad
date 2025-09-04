import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerationRequest {
  term: string;
  category?: string;
  languages?: string[];
  priority?: number;
}

interface GeneratedTerm {
  term: string;
  phonetic_en: string;
  phonetic_ar: string;
  category: string;
  definition_en: string;
  definition_ar: string;
  definition_fa?: string;
  example_en: string;
  example_ar: string;
  example_fa?: string;
  tags: string[];
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

    const { term, category = 'General', languages = ['en', 'ar'], priority = 5 }: GenerationRequest = await req.json();

    console.log(`Generating definition for term: ${term}, category: ${category}`);

    // Check if term already exists
    const { data: existing } = await supabase
      .from('dictionary')
      .select('id, term, slug')
      .eq('term', term)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Term already exists',
        existing: existing
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create enhanced AI prompt for comprehensive term generation
    const systemPrompt = `You are an expert lexicographer creating comprehensive definitions for a management and leadership encyclopedia. 

Your task is to generate detailed, accurate, and educational definitions for terms related to:
- Management & Leadership
- Psychology & Behavioral Science  
- Finance & Economics
- Entrepreneurship & Business
- Communication & Strategy
- Technology & Innovation

For each term, provide:
1. Accurate phonetic spellings in both English and Arabic
2. Clear, concise definitions suitable for teenagers and young adults
3. Practical examples that relate to real-world scenarios
4. Relevant tags for categorization

Return ONLY valid JSON with no additional text or formatting.`;

    const userPrompt = `Generate a comprehensive lexicon entry for the term "${term}" in the category "${category}".

Include:
- English phonetic spelling (IPA or simplified)
- Arabic phonetic transliteration 
- Clear definition in English (100-200 words)
- Clear definition in Arabic (100-200 words)
- Practical example sentence in English
- Practical example sentence in Arabic
- 3-5 relevant tags for search and categorization

Format as JSON:
{
  "term": "${term}",
  "phonetic_en": "phonetic spelling",
  "phonetic_ar": "Arabic transliteration", 
  "category": "${category}",
  "definition_en": "English definition",
  "definition_ar": "Arabic definition",
  "example_en": "English example sentence",
  "example_ar": "Arabic example sentence", 
  "tags": ["tag1", "tag2", "tag3"]
}`;

    console.log('Calling OpenAI API for term generation...');

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
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    console.log('AI Response received:', generatedContent);

    // Parse the AI response
    let generatedTerm: GeneratedTerm;
    try {
      generatedTerm = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Generate slug
    const slug = term.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Prepare data for database insertion
    const lexiconEntry = {
      term: generatedTerm.term,
      slug: slug,
      category: generatedTerm.category,
      definition_en: generatedTerm.definition_en,
      definition_ar: generatedTerm.definition_ar,
      phonetic_en_new: generatedTerm.phonetic_en,
      phonetic_ar_new: generatedTerm.phonetic_ar,
      example_en: generatedTerm.example_en,
      example_ar: generatedTerm.example_ar,
      tags: generatedTerm.tags || [],
      discipline_tags: [generatedTerm.category],
      status: 'published',
      ai_generated: true,
      verification_status: 'pending',
      ai_generated_metadata: {
        generated_at: new Date().toISOString(),
        model: 'gpt-4.1-2025-04-14',
        languages: languages,
        generation_version: '1.0'
      },
      last_ai_update: new Date().toISOString()
    };

    console.log('Inserting lexicon entry into database...');

    // Insert into dictionary table
    const { data: insertedTerm, error: insertError } = await supabase
      .from('dictionary')
      .insert(lexiconEntry)
      .select()
      .single();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log('Successfully generated and saved term:', insertedTerm.id);

    // Log analytics
    await supabase
      .from('dictionary_analytics')
      .insert({
        term_id: insertedTerm.id,
        event_type: 'ai_term_generated',
        metadata: {
          category: generatedTerm.category,
          languages: languages,
          generation_source: 'ai_lexicon_generator'
        }
      });

    return new Response(JSON.stringify({
      success: true,
      term: insertedTerm,
      generated_data: generatedTerm
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lexicon-generator:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});