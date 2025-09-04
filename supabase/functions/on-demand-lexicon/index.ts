import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { term, category = 'General', language = 'en' } = await req.json();

    if (!term) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Term is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`On-demand generation requested for: ${term}`);

    // First, try to find existing term
    const { data: existingTerm } = await supabase
      .from('dictionary')
      .select('*')
      .or(`term.ilike.%${term}%, slug.eq.${term.toLowerCase().replace(/\s+/g, '-')}`)
      .eq('status', 'published')
      .single();

    if (existingTerm) {
      console.log(`Found existing term: ${existingTerm.term}`);
      return new Response(JSON.stringify({
        success: true,
        found_existing: true,
        term: existingTerm
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add to generation queue
    const { data: queueEntry } = await supabase
      .from('lexicon_generation_queue')
      .insert({
        term: term,
        category: category,
        priority: 1, // High priority for on-demand
        status: 'processing',
        requested_by: null, // Anonymous request
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    console.log(`Added to generation queue: ${queueEntry?.id}`);

    // Generate using AI lexicon generator
    try {
      const generationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-lexicon-generator`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          term: term,
          category: category,
          languages: ['en', 'ar'],
          priority: 1
        }),
      });

      const generationResult = await generationResponse.json();

      if (generationResult.success) {
        // Update queue status
        await supabase
          .from('lexicon_generation_queue')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            generated_data: generationResult.generated_data
          })
          .eq('id', queueEntry?.id);

        console.log(`Successfully generated on-demand term: ${term}`);

        return new Response(JSON.stringify({
          success: true,
          generated: true,
          term: generationResult.term,
          queue_id: queueEntry?.id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } else {
        // Update queue with error
        await supabase
          .from('lexicon_generation_queue')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: generationResult.error || 'Generation failed'
          })
          .eq('id', queueEntry?.id);

        throw new Error(generationResult.error || 'Generation failed');
      }

    } catch (genError) {
      console.error('Generation error:', genError);
      
      // Update queue with error
      if (queueEntry?.id) {
        await supabase
          .from('lexicon_generation_queue')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: genError.message
          })
          .eq('id', queueEntry.id);
      }

      // For user-facing response, provide a graceful fallback
      return new Response(JSON.stringify({
        success: false,
        error: 'Unable to generate term at this time',
        fallback_message: `The term "${term}" is not currently in our lexicon. Our AI system is working to add it. Please try again in a few moments or contact support for assistance.`,
        queue_id: queueEntry?.id
      }), {
        status: 202, // Accepted but not completed
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in on-demand-lexicon:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});