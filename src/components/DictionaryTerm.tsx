import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';
import { ExternalLink, Globe } from 'lucide-react';
import { Badge } from './ui/badge';

interface DictionaryTermProps {
  term: string;
  slug: string;
  definition?: string;
  category?: string;
  translations?: {
    ar?: { term: string; short_def: string };
    fa?: { term: string; short_def: string };
    es?: { term: string; short_def: string };
    fr?: { term: string; short_def: string };
    de?: { term: string; short_def: string };
    tr?: { term: string; short_def: string };
    ur?: { term: string; short_def: string };
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
  const [currentLang, setCurrentLang] = useState<'en' | 'ar' | 'fa' | 'es' | 'fr' | 'de' | 'tr' | 'ur'>('en');
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentTranslation = () => {
    if (currentLang === 'ar' && translations?.ar) {
      return {
        term: translations.ar.term,
        definition: translations.ar.short_def
      };
    }
    if (currentLang === 'fa' && translations?.fa) {
      return {
        term: translations.fa.term,
        definition: translations.fa.short_def
      };
    }
    if (currentLang === 'es' && translations?.es) {
      return {
        term: translations.es.term,
        definition: translations.es.short_def
      };
    }
    if (currentLang === 'fr' && translations?.fr) {
      return {
        term: translations.fr.term,
        definition: translations.fr.short_def
      };
    }
    if (currentLang === 'de' && translations?.de) {
      return {
        term: translations.de.term,
        definition: translations.de.short_def
      };
    }
    if (currentLang === 'tr' && translations?.tr) {
      return {
        term: translations.tr.term,
        definition: translations.tr.short_def
      };
    }
    if (currentLang === 'ur' && translations?.ur) {
      return {
        term: translations.ur.term,
        definition: translations.ur.short_def
      };
    }
    return { term, definition: definition || 'Definition coming soon' };
  };

  const { term: displayTerm, definition: displayDefinition } = getCurrentTranslation();

  const handlePopoverOpen = () => {
    setIsOpen(true);
    // Track analytics
    if (typeof window !== 'undefined') {
      // This would integrate with your analytics system
      console.log('Dictionary popover opened:', { term, slug });
    }
  };

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
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 
                id={`term-${slug}`}
                className="font-semibold text-lg text-foreground mb-1"
              >
                {displayTerm}
              </h3>
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
            </div>
            {(translations?.ar || translations?.fa || translations?.es || translations?.fr || translations?.de || translations?.tr || translations?.ur) && (
              <div className="flex flex-wrap gap-1 ml-2">
                <Button
                  variant={currentLang === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentLang('en')}
                  className="px-2 py-1 h-6 text-xs"
                >
                  EN
                </Button>
                {translations?.ar && (
                  <Button
                    variant={currentLang === 'ar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('ar')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    AR
                  </Button>
                )}
                {translations?.fa && (
                  <Button
                    variant={currentLang === 'fa' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('fa')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    FA
                  </Button>
                )}
                {translations?.es && (
                  <Button
                    variant={currentLang === 'es' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('es')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    ES
                  </Button>
                )}
                {translations?.fr && (
                  <Button
                    variant={currentLang === 'fr' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('fr')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    FR
                  </Button>
                )}
                {translations?.de && (
                  <Button
                    variant={currentLang === 'de' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('de')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    DE
                  </Button>
                )}
                {translations?.tr && (
                  <Button
                    variant={currentLang === 'tr' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('tr')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    TR
                  </Button>
                )}
                {translations?.ur && (
                  <Button
                    variant={currentLang === 'ur' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentLang('ur')}
                    className="px-2 py-1 h-6 text-xs"
                  >
                    UR
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayDefinition}
          </p>
          
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
                className="flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Learn More
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            
            <span className="text-xs text-muted-foreground">
              TMA Dictionary
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