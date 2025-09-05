import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function OpenAITestComponent() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-openai-connection');
      
      if (error) {
        throw error;
      }
      
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Connection Successful",
          description: "OpenAI API is working correctly",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test failed:', error);
      setResult({
        success: false,
        error: error.message || 'Test failed'
      });
      toast({
        title: "Test Failed",
        description: "Could not test OpenAI connection",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          OpenAI API Connection Test
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
            'Test OpenAI API Connection'
          )}
        </Button>

        {result && (
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
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">Technical Details</summary>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}