import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminOpenAITestFix() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('Testing OpenAI API connection with improved error handling...');
      const { data, error } = await supabase.functions.invoke('test-openai-connection');
      
      console.log('Edge function response:', { data, error });
      
      if (error) {
        // This should not happen with the fixed edge function, but just in case
        console.error('Edge function error:', error);
        setResult({
          success: false,
          error: `Edge Function Error: ${error.message}`,
          details: error,
          error_type: 'edge_function_error'
        });
        toast({
          title: "Edge Function Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setResult(data);
      
      if (data?.success) {
        toast({
          title: "Connection Successful ✅",
          description: "OpenAI API is working correctly",
        });
      } else {
        // Enhanced error handling for different failure types
        const errorMessage = data?.error || "Unknown error from OpenAI API";
        const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('insufficient');
        const isAuthError = errorMessage.includes('unauthorized') || errorMessage.includes('authentication');
        
        let description = errorMessage;
        let title = "Connection Failed";
        
        if (isQuotaError) {
          title = "Quota Exceeded";
          description = "OpenAI API quota exceeded. Please check your billing settings and add credits.";
        } else if (isAuthError) {
          title = "Authentication Failed";
          description = "OpenAI API key is invalid or missing. Please check your Supabase secrets.";
        }
        
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test failed with exception:', error);
      setResult({
        success: false,
        error: `Test Exception: ${error.message || 'Unknown error'}`,
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        error_type: 'network_error'
      });
      toast({
        title: "Test Failed",
        description: `Could not test OpenAI connection: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getErrorTypeInfo = (result: any) => {
    if (!result || result.success) return null;
    
    const error = result.error || '';
    const isQuotaError = error.includes('quota') || error.includes('insufficient');
    const isAuthError = error.includes('unauthorized') || error.includes('authentication') || error.includes('not configured');
    const isNetworkError = result.error_type === 'network_error';
    
    if (isQuotaError) {
      return {
        type: 'quota',
        title: 'Quota Exceeded',
        description: 'Your OpenAI account has exceeded its usage quota. Add billing/credits to continue.',
        actionable: true
      };
    } else if (isAuthError) {
      return {
        type: 'auth',
        title: 'Authentication Issue',
        description: 'OpenAI API key is missing or invalid. Check Supabase Edge Function secrets.',
        actionable: true
      };
    } else if (isNetworkError) {
      return {
        type: 'network',
        title: 'Network Error',
        description: 'Could not connect to OpenAI API. Check internet connection.',
        actionable: false
      };
    }
    
    return {
      type: 'unknown',
      title: 'Unknown Error',
      description: 'An unexpected error occurred.',
      actionable: false
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          OpenAI API Connection Test (Enhanced)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test OpenAI API Connection
            </>
          )}
        </Button>

        {result && (
          <>
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {result.success ? (
                  <>
                    <p><strong>Message:</strong> {result.message}</p>
                    <p><strong>Response:</strong> {result.response}</p>
                    <p><strong>Model:</strong> {result.model}</p>
                    {result.usage && (
                      <p><strong>Tokens Used:</strong> {result.usage.total_tokens}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p><strong>Error:</strong> {result.error}</p>
                    {result.status_code && (
                      <p><strong>Status Code:</strong> {result.status_code}</p>
                    )}
                    {result.request_id && result.request_id !== 'unknown' && (
                      <p><strong>Request ID:</strong> {result.request_id}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {!result.success && (
              <>
                {getErrorTypeInfo(result) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{getErrorTypeInfo(result)?.title}:</strong> {getErrorTypeInfo(result)?.description}
                    </AlertDescription>
                  </Alert>
                )}
                
                {result.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium text-sm">Technical Details</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </>
            )}
          </>
        )}

        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Test Details:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Uses the same OpenAI client configuration as lexicon generation</li>
            <li>Tests with model: gpt-4.1-2025-04-14</li>
            <li>Improved error handling with detailed status reporting</li>
            <li>All edge functions now return consistent 200 status codes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}