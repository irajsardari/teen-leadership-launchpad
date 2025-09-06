import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Languages, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supportedLanguages } from '@/utils/language';

interface BatchTranslationManagerProps {
  terms: Array<{
    id: string;
    term: string;
    translations?: any;
    status: string;
  }>;
  onRefresh: () => void;
}

const BatchTranslationManager: React.FC<BatchTranslationManagerProps> = ({ terms, onRefresh }) => {
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['ar', 'fa']);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const publishedTerms = terms.filter(term => term.status === 'published');
  const translationLanguages = Object.entries(supportedLanguages).filter(([code]) => code !== 'en');

  const handleTermSelection = (termId: string, checked: boolean) => {
    if (checked) {
      setSelectedTerms(prev => [...prev, termId]);
    } else {
      setSelectedTerms(prev => prev.filter(id => id !== termId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTerms(publishedTerms.map(term => term.id));
    } else {
      setSelectedTerms([]);
    }
  };

  const handleLanguageSelection = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages(prev => [...prev, language]);
    } else {
      setSelectedLanguages(prev => prev.filter(lang => lang !== language));
    }
  };

  const getTranslationStatus = (term: any) => {
    if (!term.translations) return 'No translations';
    const translatedLangs = Object.keys(term.translations).filter(lang => lang !== 'en');
    const totalSupportedLangs = translationLanguages.length;
    return `${translatedLangs.length}/${totalSupportedLangs} languages`;
  };

  const startBatchTranslation = async () => {
    if (selectedTerms.length === 0 || selectedLanguages.length === 0) {
      toast({
        title: 'Selection Required',
        description: 'Please select terms and languages for translation.',
        variant: 'destructive',
      });
      return;
    }

    setIsTranslating(true);
    setProgress(0);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-translations', {
        body: {
          termIds: selectedTerms,
          languages: selectedLanguages
        }
      });

      if (error) throw error;

      setResults(data);
      setProgress(100);

      toast({
        title: 'Translation Complete',
        description: `Successfully translated ${data.success} terms. ${data.failed} failed.`,
        variant: data.failed > 0 ? 'destructive' : 'default',
      });

      onRefresh();
    } catch (error: any) {
      console.error('Batch translation error:', error);
      toast({
        title: 'Translation Failed',
        description: error.message || 'An error occurred during batch translation.',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Batch Translation Generator
          </CardTitle>
          <p className="text-muted-foreground">
            Generate translations for multiple terms using AI. Only published terms can be translated.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div>
            <h4 className="font-medium mb-3">Select Target Languages</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {translationLanguages.map(([code, config]) => (
                <div key={code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang-${code}`}
                    checked={selectedLanguages.includes(code)}
                    onCheckedChange={(checked) => handleLanguageSelection(code, !!checked)}
                  />
                  <label
                    htmlFor={`lang-${code}`}
                    className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <span>{config.flag}</span>
                    {config.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Term Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Select Terms ({selectedTerms.length}/{publishedTerms.length})</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedTerms.length === publishedTerms.length && publishedTerms.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All
                </label>
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
              {publishedTerms.map((term) => (
                <div key={term.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`term-${term.id}`}
                      checked={selectedTerms.includes(term.id)}
                      onCheckedChange={(checked) => handleTermSelection(term.id, !!checked)}
                    />
                    <label
                      htmlFor={`term-${term.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {term.term}
                    </label>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getTranslationStatus(term)}
                  </Badge>
                </div>
              ))}
              
              {publishedTerms.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No published terms available for translation.
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          {isTranslating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Translation Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <h4 className="font-medium">Translation Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Successful: {results.success}</span>
                </div>
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed: {results.failed}</span>
                </div>
              </div>
              
              {results.errors.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View Errors ({results.errors.length})
                  </summary>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-red-600 text-xs font-mono bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={startBatchTranslation}
            disabled={isTranslating || selectedTerms.length === 0 || selectedLanguages.length === 0}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Translations...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4 mr-2" />
                Generate Translations ({selectedTerms.length} terms, {selectedLanguages.length} languages)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchTranslationManager;