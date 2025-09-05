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

// Exponential backoff retry function for quota handling with better rate limiting
async function callOpenAIWithRetry(openAIApiKey: string, requestBody: any, maxRetries = 4): Promise<any> {
  // Use more cost-effective model for better rate limits
  if (requestBody.model === 'gpt-4.1-2025-04-14') {
    requestBody.model = 'gpt-4o-mini';
    console.log('🔄 Switched to gpt-4o-mini for better rate limits');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const requestStartTime = Date.now();
    
    try {
      console.log(`🚀 OpenAI API Attempt ${attempt}/${maxRetries} - Model: ${requestBody.model}`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const duration = Date.now() - requestStartTime;
      const requestId = response.headers.get('x-request-id') || response.headers.get('openai-request-id') || 'unknown';
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ OpenAI Success - Attempt ${attempt}, Request ID: ${requestId}, Duration: ${duration}ms, Tokens: ${result.usage?.total_tokens || 'unknown'}`);
        return { success: true, data: result, requestId, duration, attempt };
      }

      // Handle different error types
      const errorText = await response.text();
      let errorObj;
      try {
        errorObj = JSON.parse(errorText);
      } catch (e) {
        errorObj = { error: { message: errorText } };
      }

      const isQuotaError = response.status === 429 || (errorObj.error?.code === 'insufficient_quota');
      const isRateLimitError = response.status === 429 || (errorObj.error?.type === 'rate_limit_exceeded');
      
      console.error(`OpenAI API Error - Attempt ${attempt}, Status: ${response.status}, Request ID: ${requestId}, Duration: ${duration}ms`);
      console.error(`Error Details:`, { status: response.status, error: errorObj.error?.message });

      // Don't retry on certain errors
      if (response.status === 401 || response.status === 403 || response.status === 400) {
        return {
          success: false,
          error: errorObj.error?.message || 'API authentication or request error',
          status: response.status,
          requestId,
          duration,
          attempt,
          retryable: false
        };
      }

      // Retry with longer exponential backoff for rate limit/quota errors
      if ((isQuotaError || isRateLimitError) && attempt < maxRetries) {
        // More aggressive backoff for 429 errors - start at 5 seconds, max 60 seconds
        const baseDelay = isRateLimitError ? 5000 : 2000; // 5s for rate limits, 2s for quota
        const backoffDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), 60000);
        console.log(`⏳ Rate/Quota limit error (${response.status}). Retrying in ${backoffDelay/1000}s... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }

      // Final attempt failed
      return {
        success: false,
        error: errorObj.error?.message || `API error: ${response.status}`,
        status: response.status,
        requestId,
        duration,
        attempt,
        retryable: isQuotaError || isRateLimitError
      };

    } catch (networkError) {
      const duration = Date.now() - requestStartTime;
      console.error(`Network error on attempt ${attempt}:`, networkError);
      
      if (attempt < maxRetries) {
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Network error. Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      
      return {
        success: false,
        error: `Network error: ${networkError.message}`,
        duration,
        attempt,
        retryable: true
      };
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured in Supabase secrets'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
        status: 200,
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

    const promptSize = (systemPrompt + userPrompt).length;
    console.log(`OpenAI Request - Model: gpt-4.1-2025-04-14, Prompt Size: ${promptSize} chars, Term: "${term}"`);
    console.log(`Prompt Preview: ${userPrompt.substring(0, 200)}...`);

    // Call OpenAI with retry logic
    const openAIResult = await callOpenAIWithRetry(openAIApiKey, {
      model: 'gpt-4.1-2025-04-14',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 3000,
    });

    if (!openAIResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: openAIResult.error,
        error_code: openAIResult.retryable ? 'quota_exceeded' : 'api_error',
        status_code: openAIResult.status || 500,
        request_id: openAIResult.requestId || 'unknown',
        attempts: openAIResult.attempt,
        retryable: openAIResult.retryable || false
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = openAIResult.data;
    console.log(`Response Preview: ${aiResponse.choices?.[0]?.message?.content?.substring(0, 200)}...`);
    
    // Handle standard Chat Completions API format
    const generatedContent = aiResponse.choices?.[0]?.message?.content;

    // Parse the AI response
    let generatedTerm: GeneratedTerm;
    try {
      generatedTerm = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid AI response format - could not parse JSON',
        raw_response: generatedContent?.substring(0, 500) || 'No response content'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      discipline_tags: [generatedTerm.category, generatedTerm.subcategory].filter(Boolean),
      synonyms: generatedTerm.related_terms || [],
      related: generatedTerm.related_terms || [],
      status: 'published',
      ai_generated: true,
      verification_status: 'ai_enhanced',
      complexity_level: generatedTerm.difficulty_level || 'intermediate',
      ai_generated_metadata: {
        generated_at: new Date().toISOString(),
        model: 'gpt-4.1-2025-04-14',
        api_endpoint: 'chat_completions',
        languages: languages,
        generation_version: '3.2_world_reference_with_retry',
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
        subcategory: generatedTerm.subcategory,
        retry_attempts: openAIResult.attempt,
        generation_duration_ms: openAIResult.duration,
        request_id: openAIResult.requestId
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
      return new Response(JSON.stringify({
        success: false,
        error: `Database error: ${insertError.message}`,
        error_code: 'database_error'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully generated and saved term: ${insertedTerm.id} for "${term}" (Duration: ${openAIResult.duration}ms, Tokens: ${aiResponse.usage?.total_tokens || 'unknown'}, Attempts: ${openAIResult.attempt})`);

    // Log analytics
    await supabase
      .from('dictionary_analytics')
      .insert({
        term_id: insertedTerm.id,
        event_type: 'ai_term_generated',
        metadata: {
          category: generatedTerm.category,
          languages: languages,
          generation_source: 'ai_lexicon_generator_with_retry',
          retry_attempts: openAIResult.attempt,
          generation_duration_ms: openAIResult.duration,
          request_id: openAIResult.requestId
        }
      });

    return new Response(JSON.stringify({
      success: true,
      term: insertedTerm,
      generated_data: generatedTerm,
      generation_stats: {
        attempts: openAIResult.attempt,
        duration_ms: openAIResult.duration,
        tokens_used: aiResponse.usage?.total_tokens || 0,
        request_id: openAIResult.requestId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-lexicon-generator-with-retry:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred',
      error_code: 'internal_error'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});