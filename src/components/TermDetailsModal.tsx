import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Volume2, Globe, ExternalLink, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Lang } from '@/utils/language';
import { Link } from 'react-router-dom';

interface DictionaryTerm {
  id: string;
  term: string;
  slug: string;
  short_def: string;
  long_def: string;
  category: string;
  synonyms: string[];
  related: string[];
  translations: any;
  phonetic_en?: string;
  phonetic_ar?: string;
  phonetic_fa?: string;
  examples?: string[];
  discipline_tags?: string[];
  sources?: string[];
  verification_status?: string;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

interface TermDetailsModalProps {
  term: DictionaryTerm;
  isOpen: boolean;
  onClose: () => void;
}

export const TermDetailsModal: React.FC<TermDetailsModalProps> = ({ term, isOpen, onClose }) => {
  const { currentLang, translate, isTranslating } = useLanguage();
  const [currentTranslation, setCurrentTranslation] = useState<any>(null);

  const getCurrentTermDisplay = () => {
    if (currentLang === 'en') {
      return { term: term.term, definition: term.long_def };
    }

    if (currentTranslation) {
      return {
        term: currentTranslation.term || term.term,
        definition: currentTranslation.definition || term.long_def
      };
    }

    if (term.translations) {
      const translation = term.translations[currentLang];
      if (translation) {
        return {
          term: translation.term || term.term,
          definition: translation.definition || term.long_def
        };
      }
    }

    return { term: term.term, definition: term.long_def };
  };

  const handleLanguageSwitch = async (lang: Lang) => {
    if (lang === 'ar' || lang === 'fa') {
      try {
        const translation = await translate(term.slug, lang);
        if (translation) {
          setCurrentTranslation(translation);
        }
      } catch (error) {
        console.error('Translation failed:', error);
      }
    } else {
      setCurrentTranslation(null);
    }
  };

  const currentDisplay = getCurrentTermDisplay();
  const phonetic = currentLang === 'ar' ? term.phonetic_ar : 
                  currentLang === 'fa' ? term.phonetic_fa : 
                  term.phonetic_en;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-tma-blue mb-2">
                {currentDisplay.term}
              </DialogTitle>
              {phonetic && (
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span className="font-mono">/{phonetic}/</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 hover:bg-tma-orange/10"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {term.category && (
                  <Badge variant="secondary" className="bg-tma-blue/10 text-tma-blue">
                    {term.category}
                  </Badge>
                )}
                {term.verification_status === 'verified' && (
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-1">
              <Button
                variant={currentLang === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageSwitch('en')}
                disabled={isTranslating}
              >
                🇺🇸 EN
              </Button>
              <Button
                variant={currentLang === 'ar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageSwitch('ar')}
                disabled={isTranslating}
              >
                {isTranslating && currentLang === 'ar' ? '⏳' : '🇸🇦'} AR
              </Button>
              <Button
                variant={currentLang === 'fa' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLanguageSwitch('fa')}
                disabled={isTranslating}
              >
                {isTranslating && currentLang === 'fa' ? '⏳' : '🇮🇷'} FA
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Definition */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-tma-orange" />
              Definition
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {currentDisplay.definition}
            </p>
          </div>

          <Separator />

          {/* Example Sentences */}
          {term.examples && term.examples.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Example Usage</h3>
                <div className="space-y-3">
                  {term.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-tma-cream/30 rounded-lg border-l-4 border-tma-orange">
                      <p className="italic text-muted-foreground">"{example}"</p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Synonyms */}
          {term.synonyms && term.synonyms.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Synonyms</h3>
                <div className="flex flex-wrap gap-2">
                  {term.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Discipline Tags */}
          {term.discipline_tags && term.discipline_tags.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Related Disciplines</h3>
                <div className="flex flex-wrap gap-2">
                  {term.discipline_tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-tma-cream">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              asChild 
              className="bg-tma-orange hover:bg-tma-orange/90 text-white"
            >
              <Link to={`/dictionary/${term.slug}`} onClick={onClose}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Page
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};