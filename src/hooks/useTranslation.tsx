import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TranslationProgress {
  processed: number;
  translated: number;
  skipped: number;
  errors: number;
  languages: string[];
}

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState<TranslationProgress | null>(null);

  const translateSingleTerm = async (termId: string): Promise<boolean> => {
    try {
      setIsTranslating(true);
      
      const { data, error } = await supabase.functions.invoke('translate-dictionary', {
        body: { termId }
      });

      if (error) throw error;

      const result = data as TranslationProgress;
      setProgress(result);

      if (result.translated > 0) {
        toast({
          title: 'Translation Complete',
          description: `Successfully translated "${result.translated}" languages for this term.`,
        });
        return true;
      } else if (result.skipped > 0) {
        toast({
          title: 'Already Translated',
          description: 'This term already has all available translations.',
        });
        return false;
      } else {
        toast({
          title: 'Translation Failed',
          description: 'Unable to generate translations for this term.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Error',
        description: error.message || 'Failed to translate term',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateAllTerms = async (): Promise<boolean> => {
    try {
      setIsTranslating(true);
      
      toast({
        title: 'Starting Batch Translation',
        description: 'Translating all dictionary terms to 7 languages...',
      });

      const { data, error } = await supabase.functions.invoke('translate-dictionary', {
        body: { translateAll: true }
      });

      if (error) throw error;

      const result = data as TranslationProgress;
      setProgress(result);

      toast({
        title: 'Batch Translation Complete',
        description: `Processed ${result.processed} terms. Translated: ${result.translated}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
      });

      return result.translated > 0 || result.skipped > 0;
    } catch (error: any) {
      console.error('Batch translation error:', error);
      toast({
        title: 'Batch Translation Failed',
        description: error.message || 'Failed to translate terms',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translateSingleTerm,
    translateAllTerms,
    isTranslating,
    progress
  };
};