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
  subcategory?: string;
  definition_en: string;
  definition_ar: string;
  etymology?: string;
  key_theorists?: string[];
  historical_context?: string;
  practical_applications?: string[];
  example_en: string;
  example_ar: string;
  related_terms?: string[];
  antonyms?: string[];
  industry_applications?: string[];
  measurement_methods?: string[];
  common_misconceptions?: string[];
  contemporary_relevance?: string;
  academic_sources?: string[];
  tags: string[];
  difficulty_level?: string;
  executive_summary?: string;
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

    // Create world-class management reference AI prompt
    const systemPrompt = `You are a distinguished lexicographer and management scholar creating the definitive world reference encyclopedia for management and leadership terminology. 

Your expertise spans:
- Classical & Modern Management Theory (Taylor, Fayol, Drucker, Porter, Kotter)
- Organizational Psychology & Behavioral Science
- Strategic Management & Corporate Strategy  
- Leadership Theory & Executive Development
- Financial Management & Corporate Finance
- Entrepreneurship & Innovation Management
- Digital Transformation & Technology Leadership
- Operations Management & Supply Chain
- Human Resource Management & Organizational Development
- Change Management & Organizational Culture

Create authoritative, scholarly entries that serve as the global standard reference. Each entry must be:
- Academically rigorous with historical context
- Practically applicable for modern organizations
- Cross-referenced with related concepts
- Suitable for executives, students, and researchers

Return ONLY valid JSON with no additional text or formatting.`;

    const userPrompt = `Generate a world-class reference entry for "${term}" in ${category}.

Create a comprehensive entry with:

1. **Academic Foundation**: Historical development, key theorists, foundational literature
2. **Precise Definition**: Multiple contextual definitions (corporate, startup, academic, consulting)
3. **Etymology & Evolution**: Word origins, how meaning evolved over time
4. **Cross-References**: Related terms, antonyms, hierarchical relationships
5. **Practical Applications**: Real-world usage in different organizational contexts
6. **Industry Variations**: How the term applies differently across industries
7. **Contemporary Relevance**: Modern adaptations, digital age implications
8. **Measurement & Assessment**: How this concept is evaluated or measured
9. **Common Misconceptions**: Frequent misunderstandings or misapplications
10. **Future Outlook**: Emerging trends and evolution of the concept

Format as JSON:
{
  "term": "${term}",
  "phonetic_en": "IPA phonetic spelling",
  "phonetic_ar": "Arabic transliteration",
  "category": "${category}",
  "subcategory": "specific subcategory",
  "definition_en": "Comprehensive English definition (200-400 words)",
  "definition_ar": "Comprehensive Arabic definition (200-400 words)",
  "etymology": "Word origin and historical development",
  "key_theorists": ["theorist1", "theorist2", "theorist3"],
  "historical_context": "How this concept developed in management theory",
  "practical_applications": ["application1", "application2", "application3"],
  "example_en": "Professional example in business context",
  "example_ar": "Professional example in Arabic",
  "related_terms": ["term1", "term2", "term3"],
  "antonyms": ["opposite1", "opposite2"],
  "industry_applications": ["industry1: specific use", "industry2: specific use"],
  "measurement_methods": ["how it's measured or assessed"],
  "common_misconceptions": ["misconception and correction"],
  "contemporary_relevance": "Modern applications and digital age adaptations",
  "academic_sources": ["reference1", "reference2", "reference3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "difficulty_level": "beginner/intermediate/advanced",
  "executive_summary": "One-sentence key insight for busy executives"
}`;

    console.log('Calling OpenAI Responses API for world-class term generation...');

    // Use the correct OpenAI Responses API endpoint and format
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: `${systemPrompt}\n\n${userPrompt}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries()),
        request_id: response.headers.get('x-request-id') || 'unknown'
      };
      
      console.error('OpenAI Responses API error:', errorDetails);
      
      // Parse error for detailed reporting
      let errorMessage = `OpenAI API error: ${response.status}`;
      let errorCode = 'unknown';
      
      try {
        const errorObj = JSON.parse(errorText);
        if (errorObj.error?.message) {
          errorMessage = errorObj.error.message;
          errorCode = errorObj.error?.code || errorObj.error?.type || 'api_error';
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // Return structured error for better handling
      throw new Error(JSON.stringify({
        message: errorMessage,
        code: errorCode,
        status: response.status,
        request_id: errorDetails.request_id,
        full_details: errorDetails
      }));
    }

    const aiResponse = await response.json();
    
    // Handle Responses API format (different from Chat Completions)
    const generatedContent = aiResponse.output || aiResponse.text || aiResponse.choices?.[0]?.message?.content;

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

    // Prepare comprehensive data for database insertion
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
      discipline_tags: [generatedTerm.category, generatedTerm.subcategory].filter(Boolean),
      synonyms: generatedTerm.related_terms || [],
      related: generatedTerm.related_terms || [],
      status: 'published',
      ai_generated: true,
      verification_status: 'ai_enhanced',
      complexity_level: generatedTerm.difficulty_level || 'intermediate',
        ai_generated_metadata: {
        generated_at: new Date().toISOString(),
        model: 'gpt-4.1-mini',
        api_endpoint: 'responses_api',
        languages: languages,
        generation_version: '3.0_world_reference_responses_api',
        etymology: generatedTerm.etymology,
        key_theorists: generatedTerm.key_theorists,
        historical_context: generatedTerm.historical_context,
        practical_applications: generatedTerm.practical_applications,
        antonyms: generatedTerm.antonyms,
        industry_applications: generatedTerm.industry_applications,
        measurement_methods: generatedTerm.measurement_methods,
        common_misconceptions: generatedTerm.common_misconceptions,
        contemporary_relevance: generatedTerm.contemporary_relevance,
        academic_sources: generatedTerm.academic_sources,
        executive_summary: generatedTerm.executive_summary,
        subcategory: generatedTerm.subcategory
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
    
    // Try to parse structured error info
    let errorInfo;
    try {
      errorInfo = JSON.parse(error.message);
    } catch (e) {
      errorInfo = { message: error.message };
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorInfo.message || error.message,
      error_code: errorInfo.code || 'unknown',
      status_code: errorInfo.status || 500,
      request_id: errorInfo.request_id || 'unknown',
      details: errorInfo.full_details || null
    }), {
      status: errorInfo.status || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});