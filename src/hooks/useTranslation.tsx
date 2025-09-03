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
        // Silent fallback - no error message shown to user
        console.log('Translation unavailable, falling back to English');
        return false;
      }
    } catch (error: any) {
      // Silent fallback - no error message shown to user
      console.log('Translation unavailable, falling back to English:', error);
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

  const addManualTranslation = async (
    termSlug: string, 
    language: 'ar' | 'fa', 
    translatedTerm: string, 
    translatedDefinition: string
  ): Promise<boolean> => {
    try {
      // First get the current term
      const { data: term, error: fetchError } = await supabase
        .from('dictionary')
        .select('*')
        .eq('slug', termSlug)
        .single();

      if (fetchError || !term) {
        toast({
          title: 'Error',
          description: 'Term not found',
          variant: 'destructive',
        });
        return false;
      }

      // Update the translations
      const currentTranslations = (term.translations as Record<string, any>) || {};
      const updatedTranslations = {
        ...currentTranslations,
        [language]: {
          term: translatedTerm,
          shortDef: translatedDefinition,
          updatedAt: new Date().toISOString(),
          source: 'human'
        }
      };

      const { error: updateError } = await supabase
        .from('dictionary')
        .update({ 
          translations: updatedTranslations,
          translation_updated_at: new Date().toISOString()
        })
        .eq('id', term.id);

      if (updateError) {
        toast({
          title: 'Update Failed',
          description: updateError.message,
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Translation Added',
        description: `Successfully added ${language} translation for "${term.term}"`,
        variant: 'default',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    translateSingleTerm,
    translateAllTerms,
    addManualTranslation,
    isTranslating,
    progress
  };
};