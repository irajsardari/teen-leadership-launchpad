export type Lang = 'en' | 'ar' | 'fa' | 'zh' | 'hi';

export interface TranslationData {
  term: string;
  shortDef: string;
  updatedAt?: string;
  source?: 'ai' | 'human';
}

export interface LanguageConfig {
  code: Lang;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const supportedLanguages: Record<Lang, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  },
  fa: {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    direction: 'rtl',
    flag: '🇮🇷'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    flag: '🇨🇳'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    flag: '🇮🇳'
  }
};

export const STORAGE_KEY = 'tma_lang';

/**
 * Detect user's preferred language from browser settings
 */
export function detectBrowserLanguage(): Lang {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('fa') || browserLang.startsWith('pe')) return 'fa';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('hi')) return 'hi';
  
  return 'en';
}

/**
 * Get user's current language preference
 */
export function getCurrentLanguage(): Lang {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem(STORAGE_KEY) as Lang;
  if (stored && supportedLanguages[stored]) {
    return stored;
  }
  
  return detectBrowserLanguage();
}

/**
 * Set user's language preference
 */
export function setCurrentLanguage(lang: Lang): void {
  if (typeof window === 'undefined') return;
  
  if (supportedLanguages[lang]) {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

/**
 * Check if language uses right-to-left text direction
 */
export function isRTL(lang: Lang): boolean {
  return supportedLanguages[lang]?.direction === 'rtl';
}

/**
 * Get language configuration
 */
export function getLanguageConfig(lang: Lang): LanguageConfig {
  return supportedLanguages[lang] || supportedLanguages.en;
}

/**
 * Format text direction attribute
 */
export function getTextDirection(lang: Lang): 'ltr' | 'rtl' {
  return supportedLanguages[lang]?.direction || 'ltr';
}

/**
 * Get CSS classes for RTL support
 */
export function getRTLClasses(lang: Lang): string {
  const isRightToLeft = isRTL(lang);
  
  return [
    isRightToLeft ? 'text-right' : 'text-left',
    isRightToLeft ? 'rtl' : 'ltr'
  ].join(' ');
}

/**
 * Map language code to OpenAI-compatible language name
 */
export function getLanguageForTranslation(lang: Lang): string {
  const mapping = {
    en: 'English',
    ar: 'Arabic',
    fa: 'Persian',
    zh: 'Chinese',
    hi: 'Hindi'
  };
  
  return mapping[lang] || 'English';
}