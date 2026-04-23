import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const authSupabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authSupabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🚀 Starting OpenAI API connection test with environment variable...');
    
    // Debug: List all available environment variables (without values for security)
    const envVars = Object.keys(Deno.env.toObject()).filter(key => 
      key.includes('OPENAI') || key.includes('API')
    );
    console.log('🔍 Available API-related environment variables:', envVars);
    
    // Use environment variable as requested
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    console.log('🔑 Checking API key availability...');
    console.log('🔍 Environment variable name used: "OPENAI_API_KEY"');
    
    if (!apiKey) {
      console.error('❌ OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key not configured - please set OPENAI_API_KEY in Supabase Edge Functions secrets',
        error_type: 'missing_api_key',
        status_code: 500,
        request_id: 'no-key-' + Date.now(),
        environment_check: 'FAILED: OPENAI_API_KEY environment variable not found',
        debug_info: {
          expected_secret_name: 'OPENAI_API_KEY',
          available_env_vars: envVars,
          supabase_setup_url: 'https://supabase.com/dashboard/project/gedgcagidpheugikoyim/settings/functions'
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Additional validation checks
    const trimmedKey = apiKey.trim();
    const hasValidPrefix = trimmedKey.startsWith('sk-');
    const hasValidLength = trimmedKey.length >= 40;
    
    console.log('✅ API key found from environment variable');
    console.log('📊 API key validation:');
    console.log('  - Length:', trimmedKey.length);
    console.log('  - Has sk- prefix:', hasValidPrefix);
    console.log('  - Valid length (>=40):', hasValidLength);
    console.log('  - Prefix:', trimmedKey.substring(0, 7) + '...');
    
    if (!hasValidPrefix || !hasValidLength) {
      console.warn('⚠️  API key format looks suspicious');
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key format appears invalid',
        error_type: 'invalid_api_key_format',
        status_code: 400,
        request_id: 'invalid-format-' + Date.now(),
        debug_info: {
          key_length: trimmedKey.length,
          has_sk_prefix: hasValidPrefix,
          expected_format: 'sk-proj-... or sk-...',
          current_prefix: trimmedKey.substring(0, 7)
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Simple health check with sample completion as requested
    console.log('🧪 Running health check with sample completion...');
    const startTime = Date.now();
    
    const requestBody = {
      model: "gpt-4.1-mini-2025-04-14",
      messages: [{ role: "user", content: "Hello, test connection." }],
      max_completion_tokens: 50,
    };
    
    console.log('📡 Making request to OpenAI API...');
    console.log('🎯 Endpoint: https://api.openai.com/v1/chat/completions');
    console.log('🤖 Model:', requestBody.model);
    console.log('💬 Test message:', requestBody.messages[0].content);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${trimmedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      
      console.log('✅ OpenAI API connection successful! Duration:', duration + 'ms');
      console.log('📊 Usage:', JSON.stringify(data.usage));
      
      // Log the response content as requested in the health check
      const responseContent = data.choices?.[0]?.message?.content || 'No response content';
      console.log(responseContent);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'OpenAI API connection successful - environment variable properly configured',
        response: responseContent,
        model: "gpt-4.1-mini-2025-04-14",
        duration_ms: duration,
        usage: data.usage,
        request_id: data.id || response.headers.get('x-request-id') || 'success-' + Date.now(),
        environment_check: 'SUCCESS: OPENAI_API_KEY environment variable found and working',
        deployment_status: 'Ready for all environments (production, staging, local)'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Handle error responses
    const responseText = await response.text();
    
    console.log('❌ OpenAI Response Status:', response.status);
    console.log('📋 OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📄 OpenAI Response Body:', responseText);

    let errorDetails = {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
      request_id: response.headers.get('x-request-id') || 'error-' + Date.now(),
      duration_ms: duration
    };
    
    let errorMessage = 'OpenAI API connection failed';
    let errorType = 'api_error';
    
    try {
      const errorObj = JSON.parse(responseText);
      errorDetails.parsedError = errorObj;
      console.error('📄 Parsed OpenAI Error:', errorObj);
      
      // Handle specific error types with actionable advice
      if (errorObj.error?.type === 'insufficient_quota' || errorObj.error?.code === 'insufficient_quota') {
        errorMessage = 'OpenAI API quota exceeded. Your API key has reached its usage limits.';
        errorType = 'quota_exceeded';
      } else if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please verify your API key is correct.';
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
      duration_ms: duration,
      details: errorDetails,
      actionable_advice: errorType === 'quota_exceeded' ? 'Add credits to your OpenAI account at https://platform.openai.com/account/billing' : 
                        errorType === 'invalid_api_key' ? 'Verify your API key at https://platform.openai.com/api-keys and update OPENAI_API_KEY secret' :
                        'Wait a few minutes and try again',
      environment_status: 'OPENAI_API_KEY environment variable found but API call failed'
    }), {
      status: 200,
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