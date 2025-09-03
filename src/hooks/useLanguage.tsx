import { useState, useEffect, useCallback } from 'react';
import { 
  Lang, 
  getCurrentLanguage, 
  setCurrentLanguage, 
  detectBrowserLanguage,
  TranslationData 
} from '@/utils/language';
import { supabase } from '@/integrations/supabase/client';

interface UseLanguageReturn {
  currentLang: Lang;
  setLang: (lang: Lang) => void;
  isRTL: boolean;
  translate: (slug: string, lang: 'ar' | 'fa') => Promise<TranslationData | null>;
  isTranslating: boolean;
}

export const useLanguage = (): UseLanguageReturn => {
  const [currentLang, setCurrentLang] = useState<Lang>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Initialize language on mount
    const lang = getCurrentLanguage();
    setCurrentLang(lang);
  }, []);

  const setLang = useCallback((lang: Lang) => {
    setCurrentLanguage(lang);
    setCurrentLang(lang);
  }, []);

  const translate = useCallback(async (slug: string, lang: 'ar' | 'fa'): Promise<TranslationData | null> => {
    setIsTranslating(true);
    
    try {
      console.log(`Requesting translation for ${slug} -> ${lang}`);
      
      const { data, error } = await supabase.functions.invoke('translate-term', {
        body: { slug, lang }
      });

      console.log('Translation response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        // Silently fail for any translation errors
        return null;
      }

      if (!data) {
        console.log('No data returned from translation function');
        return null;
      }

      // Check if this indicates we should fall back
      if (data.fallback) {
        console.log('Translation service indicated fallback to English');
        return null;
      }

      console.log('Translation successful:', data);
      return {
        term: data.term,
        shortDef: data.shortDef,
        source: data.source,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.log('Translation request failed, falling back to English:', error);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const isRTL = currentLang === 'ar' || currentLang === 'fa';

  return {
    currentLang,
    setLang,
    isRTL,
    translate,
    isTranslating
  };
};