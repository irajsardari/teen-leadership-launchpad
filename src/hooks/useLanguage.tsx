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

      // Handle all errors gracefully - return null to fallback to English silently
      if (error) {
        console.log('Translation service error, falling back to English:', error.message);
        return null; // Silent fallback to English
      }

      if (!data || data.fallback || data.error) {
        console.log('Translation not available, falling back to English');
        return null; // Silent fallback to English
      }

      console.log('Translation successful:', data);
      return {
        term: data.term,
        shortDef: data.shortDef,
        source: data.source || 'ai',
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      // All translation errors should be silent - just fallback to English
      console.log('Translation request failed silently, falling back to English:', error);
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