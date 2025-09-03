import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';
import { ExternalLink, Globe, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Lang, 
  supportedLanguages, 
  getTextDirection, 
  getRTLClasses,
  TranslationData 
} from '@/utils/language';

interface DictionaryTermProps {
  term: string;
  slug: string;
  definition?: string;
  category?: string;
  translations?: {
    ar?: { term: string; short_def: string; source?: string };
    fa?: { term: string; short_def: string; source?: string };
    es?: { term: string; short_def: string; source?: string };
    fr?: { term: string; short_def: string; source?: string };
    de?: { term: string; short_def: string; source?: string };
    tr?: { term: string; short_def: string; source?: string };
    ur?: { term: string; short_def: string; source?: string };
  };
  children: React.ReactNode;
}

export const DictionaryTerm: React.FC<DictionaryTermProps> = ({
  term,
  slug,
  definition,
  category,
  translations,
  children
}) => {
  const { currentLang, setLang, translate, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [liveTranslations, setLiveTranslations] = useState<Partial<Record<Lang, TranslationData>>>({});
  // Removed translationError state - using silent fallback only

  // Get current translation based on active language
  const getCurrentTranslation = () => {    
    if (currentLang === 'en') {
      return { term, definition: definition || 'Definition coming soon' };
    }

    // Check live translations first
    if (liveTranslations[currentLang]) {
      const live = liveTranslations[currentLang]!;
      return { term: live.term, definition: live.shortDef };
    }

    // Check cached translations from props (only for ar/fa supported by API)
    if ((currentLang === 'ar' || currentLang === 'fa') && translations?.[currentLang]) {
      const cached = translations[currentLang];
      return { term: cached!.term, definition: cached!.short_def };
    }

    // Return English as fallback
    return { term, definition: definition || 'Definition coming soon' };
  };

  // Handle language switching with silent fallback
  const handleLanguageSwitch = async (lang: Lang) => {
    setLang(lang);
    // No error state needed - silent fallback only

    // Only attempt translation for Arabic and Persian (supported by API)
    if ((lang === 'ar' || lang === 'fa') && !liveTranslations[lang] && !translations?.[lang]) {
      try {
        const result = await translate(slug, lang);
        if (result) {
          setLiveTranslations(prev => ({
            ...prev,
            [lang]: result
          }));
        }
        // Silent fallback to English if translation fails - no error shown
      } catch (error) {
        // Silent fallback to English - no error shown to user
        console.log(`Translation not available for ${lang}, showing English version`);
      }
    }
  };

  const { term: displayTerm, definition: displayDefinition } = getCurrentTranslation();
  const textDirection = getTextDirection(currentLang);
  const rtlClasses = getRTLClasses(currentLang);

  const handlePopoverOpen = () => {
    setIsOpen(true);
    // Track analytics
    if (typeof window !== 'undefined') {
      console.log('Dictionary popover opened:', { term, slug, lang: currentLang });
    }
  };

  // Check if translation is needed and loading (only for ar/fa)
  const needsTranslation = (currentLang === 'ar' || currentLang === 'fa') && 
    !liveTranslations[currentLang] && 
    !translations?.[currentLang];
  
  const isLoading = needsTranslation && isTranslating;

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <span
          className="tma-term cursor-help underline decoration-dotted decoration-primary/50 hover:decoration-primary transition-colors"
          onClick={handlePopoverOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePopoverOpen();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Learn about ${term}`}
          aria-describedby={`definition-${slug}`}
        >
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-4 bg-background border border-border shadow-lg"
        id={`definition-${slug}`}
        role="dialog"
        aria-labelledby={`term-${slug}`}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <div className={`space-y-3 ${rtlClasses}`} dir={textDirection}>
          {/* Language Selector */}
          <div className="lang-selector">
            <button
              data-lang="en"
              onClick={() => handleLanguageSwitch('en')}
              className={currentLang === 'en' ? 'active' : ''}
              disabled={isTranslating}
            >
              EN
            </button>
            <button
              data-lang="ar"
              onClick={() => handleLanguageSwitch('ar')}
              className={currentLang === 'ar' ? 'active' : ''}
              disabled={isTranslating}
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'AR'}
            </button>
            <button
              data-lang="fa"
              onClick={() => handleLanguageSwitch('fa')}
              className={currentLang === 'fa' ? 'active' : ''}
              disabled={isTranslating}
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'FA'}
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 
                id={`term-${slug}`}
                className="font-semibold text-lg text-foreground mb-1"
              >
                {isLoading ? (
                  <div className="translation-skeleton h-6 w-32 rounded"></div>
                ) : (
                  displayTerm
                )}
              </h3>
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground leading-relaxed">
            {isLoading ? (
              <div className="space-y-2">
                <div className="translation-skeleton h-4 w-full rounded"></div>
                <div className="translation-skeleton h-4 w-3/4 rounded"></div>
              </div>
            ) : (
              displayDefinition
            )}
          </div>

          {/* Removed translation error display - graceful fallback to English */}
          
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <a 
                href={`/dictionary/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 ${currentLang === 'ar' || currentLang === 'fa' ? 'flex-row-reverse' : ''}`}
              >
                <Globe className="w-3 h-3" />
                Learn More
                <ExternalLink className={`w-3 h-3 ${currentLang === 'ar' || currentLang === 'fa' ? 'flip-rtl' : ''}`} />
              </a>
            </Button>
            
            <span className="text-xs text-muted-foreground">
              TMA Lexicon
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

// Hook for processing HTML content with dictionary terms
export const useDictionaryTerms = () => {
  const processHtmlContent = (htmlContent: string): JSX.Element => {
    // This would be enhanced to work with your dictionary data
    // For now, it returns the raw HTML
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return { processHtmlContent };
};

export default DictionaryTerm;