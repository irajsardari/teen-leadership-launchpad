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
      const { data, error } = await supabase.functions.invoke('translate-term', {
        body: { slug, lang }
      });

      if (error) {
        console.error('Translation error:', error);
        return null;
      }

      return {
        term: data.term,
        shortDef: data.shortDef,
        source: data.source,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Translation failed:', error);
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