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
    console.log('🚀 Starting OpenAI API connection test...');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    console.log('🔑 Checking API key availability...');
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key not configured in Supabase secrets',
        status_code: 500,
        request_id: 'no-key-' + Date.now()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('✅ API key found, length:', openAIApiKey.length);

    console.log('Testing OpenAI API connection...');
    console.log('API Key length:', openAIApiKey.length);
    console.log('API Key prefix:', openAIApiKey.substring(0, 10) + '...');

    // Test with Chat Completions API (the correct endpoint)
    console.log('Testing Chat Completions API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use more cost-effective model with better rate limits
        messages: [
          { role: 'user', content: 'Say "OpenAI API connection test successful"' }
        ],
        max_tokens: 50, // Use max_tokens for legacy models
      }),
    });
    
    const apiType = 'chat_completions';

    const responseText = await response.text();
    
    console.log('OpenAI Response Status:', response.status);
    console.log('OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('OpenAI Response Body:', responseText);

    if (!response.ok) {
      console.error('❌ OpenAI API call failed with status:', response.status);
      
      let errorDetails = {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        request_id: response.headers.get('x-request-id') || 'unknown'
      };
      
      let errorMessage = 'OpenAI API connection failed';
      let errorType = 'api_error';
      
      try {
        const errorObj = JSON.parse(responseText);
        errorDetails.parsedError = errorObj;
        console.error('📄 OpenAI Error Details:', errorObj);
        
        // Handle specific error types
        if (errorObj.error?.type === 'insufficient_quota' || errorObj.error?.code === 'insufficient_quota') {
          errorMessage = 'OpenAI API quota exceeded. Please check your OpenAI account billing and usage limits.';
          errorType = 'quota_exceeded';
        } else if (response.status === 401) {
          errorMessage = 'Invalid OpenAI API key. Please check your API key configuration.';
          errorType = 'invalid_api_key';
        } else if (response.status === 429) {
          errorMessage = 'OpenAI API rate limit exceeded. Please wait and try again.';
          errorType = 'rate_limit_exceeded';
        }
      } catch (e) {
        console.error('🔍 Response is not JSON, raw body:', responseText);
      }

      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
        error_type: errorType,
        status_code: response.status,
        request_id: errorDetails.request_id,
        details: errorDetails,
        actionable: errorType === 'quota_exceeded' ? 'Check OpenAI billing dashboard and add credits' : 
                   errorType === 'invalid_api_key' ? 'Verify API key is correct and has proper permissions' :
                   'Wait a few minutes and try again'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ OpenAI API call successful');
    const aiResponse = JSON.parse(responseText);
    
    const content = aiResponse.choices?.[0]?.message?.content;
    const requestId = response.headers.get('x-request-id') || 'success-' + Date.now();
    
    console.log('🎉 Test completed successfully, request ID:', requestId);
    
    return new Response(JSON.stringify({
      success: true,
      message: `OpenAI API connection successful via ${apiType}!`,
      api_type: apiType,
      response: content || 'No response content',
      model: 'gpt-4o-mini',
      usage: aiResponse.usage,
      request_id: requestId,
      recommendation: 'Using Chat Completions API for lexicon generation'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Unexpected error in test function:', error);
    const errorId = 'error-' + Date.now();
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Connection test failed',
      error_type: 'exception',
      request_id: errorId,
      details: {
        message: error.message,
        name: error.name,
        stack: error.stack
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});