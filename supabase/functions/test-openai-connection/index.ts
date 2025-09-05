import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Testing OpenAI API connection...');
    console.log('API Key length:', openAIApiKey.length);
    console.log('API Key prefix:', openAIApiKey.substring(0, 10) + '...');

    // Test with both APIs - Responses API (primary) and Chat Completions (fallback)
    console.log('Testing Responses API first...');
    
    let response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: 'Say "Responses API connection test successful"',
      }),
    });
    
    let apiType = 'responses';
    
    // Fallback to Chat Completions if Responses API fails
    if (!response.ok) {
      console.log('Responses API failed, trying Chat Completions...');
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Say "Chat Completions API connection test successful"' }
          ],
          max_tokens: 50,
        }),
      });
      apiType = 'chat_completions';
    }

    const responseText = await response.text();
    
    console.log('OpenAI Response Status:', response.status);
    console.log('OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('OpenAI Response Body:', responseText);

    if (!response.ok) {
      let errorDetails = {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      };
      
      try {
        const errorObj = JSON.parse(responseText);
        errorDetails.parsedError = errorObj;
      } catch (e) {
        // Response is not JSON
      }

      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API connection failed',
        details: errorDetails
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = JSON.parse(responseText);
    
    const content = apiType === 'responses' 
      ? (aiResponse.output || aiResponse.text)
      : (aiResponse.choices?.[0]?.message?.content);
    
    return new Response(JSON.stringify({
      success: true,
      message: `OpenAI API connection successful via ${apiType}!`,
      api_type: apiType,
      response: content || 'No response content',
      model: apiType === 'responses' ? 'gpt-4.1-mini' : 'gpt-4o-mini',
      usage: aiResponse.usage,
      recommendation: apiType === 'responses' ? 'Use Responses API for lexicon generation' : 'Responses API unavailable, using Chat Completions'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error testing OpenAI connection:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Connection test failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});