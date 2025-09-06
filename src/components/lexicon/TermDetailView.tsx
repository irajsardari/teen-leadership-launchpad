import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ArrowLeft, 
  Tags, 
  CheckCircle, 
  Volume2, 
  AlertTriangle, 
  Share2,
  Copy,
  Users,
  Lightbulb,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Lang, supportedLanguages, getTextDirection, getRTLClasses } from '@/utils/language';
import LanguageSelector from '@/components/lexicon/LanguageSelector';
import { SEOHead } from './SEOHead';

interface LexiconTerm {
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
  examples?: string[];
  discipline_tags?: string[];
  verification_status?: string;
  usage_count?: number;
  difficulty_score?: number;
  created_at: string;
  updated_at: string;
}

interface TranslationData {
  term: string;
  shortDef: string;
  updatedAt?: string;
  source?: 'ai' | 'human';
}

interface TermDetailViewProps {
  term: LexiconTerm;
  currentLang: Lang;
  onLanguageChange: (lang: Lang) => void;
  isTranslating: boolean;
  liveTranslation?: TranslationData | null;
  showTranslationNote?: boolean;
}

export const TermDetailView: React.FC<TermDetailViewProps> = ({
  term,
  currentLang,
  onLanguageChange,
  isTranslating,
  liveTranslation,
  showTranslationNote
}) => {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  const getCurrentTermDisplay = () => {
    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || '',
        hasTranslation: true
      };
    }

    // Try live translation first
    if (liveTranslation) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef,
        hasTranslation: true
      };
    }

    // Try cached translations
    if (term.translations?.[currentLang]) {
      const cached = term.translations[currentLang];
      return { 
        term: cached.term || cached.translated_term, 
        definition: cached.shortDef || cached.short_def || cached.definition,
        hasTranslation: true
      };
    }

    // Fallback to English with translation note
    return { 
      term: term.term, 
      definition: term.long_def || term.short_def || '',
      hasTranslation: false
    };
  };

  const playPronunciation = (termText: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(termText);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.lang = currentLang === 'en' ? 'en-US' : 
                      currentLang === 'ar' ? 'ar-SA' :
                      currentLang === 'fa' ? 'fa-IR' :
                      currentLang === 'zh' ? 'zh-CN' :
                      currentLang === 'hi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const shareUrl = () => {
    const url = `${window.location.origin}/lexicon/${term.slug}?lang=${currentLang}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'Term link has been copied to clipboard',
    });
    setShareOpen(false);
  };

  const { term: displayTerm, definition: displayDefinition, hasTranslation } = getCurrentTermDisplay();
  const textDirection = getTextDirection(currentLang);
  const rtlClasses = getRTLClasses(currentLang);

  // Generate structured data for SEO
  const currentUrl = `${window.location.origin}/lexicon/${term.slug}?lang=${currentLang}`;
  const alternateLanguages = Object.keys(supportedLanguages).map(lang => ({
    lang: lang as Lang,
    url: `${window.location.origin}/lexicon/${term.slug}?lang=${lang}`
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": displayTerm,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "TMA Academy Lexicon",
      "url": `${window.location.origin}/lexicon`
    },
    "description": displayDefinition.substring(0, 200),
    "termCode": term.slug,
    "url": currentUrl,
    "alternateName": term.synonyms || [],
    "subjectOf": {
      "@type": "WebPage",
      "url": currentUrl,
      "name": `${displayTerm} - TMA Academy Lexicon`,
      "description": displayDefinition.substring(0, 160),
      "inLanguage": currentLang,
      "publisher": {
        "@type": "Organization",
        "name": "TMA Academy",
        "url": window.location.origin
      }
    },
    "about": {
      "@type": "Thing",
      "name": term.category
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={textDirection}>
      <SEOHead
        title={displayTerm}
        description={displayDefinition}
        url={currentUrl}
        lang={currentLang}
        alternateLanguages={alternateLanguages}
        jsonLd={jsonLd}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/lexicon')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lexicon
          </Button>
        </div>

        <div className={`space-y-8 ${rtlClasses}`}>
          {/* Main Term Card */}
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-4xl text-primary font-bold">
                      {displayTerm}
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => playPronunciation(displayTerm)}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareUrl}
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {term.category && (
                      <Badge variant="default" className="bg-primary text-white px-3 py-1">
                        <Tags className="w-3 h-3 mr-1" />
                        {term.category}
                      </Badge>
                    )}
                    {term.verification_status === 'verified' && (
                      <Badge variant="outline" className="border-green-500 text-green-600 px-3 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified by TMA
                      </Badge>
                    )}
                    {term.difficulty_score && (
                      <Badge variant="outline" className="px-3 py-1">
                        Level {term.difficulty_score}/10
                      </Badge>
                    )}
                  </div>

                  {term.discipline_tags && term.discipline_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-muted-foreground">Related:</span>
                      {term.discipline_tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 items-end">
                  <LanguageSelector
                    currentLang={currentLang}
                    onLanguageChange={onLanguageChange}
                    isTranslating={isTranslating}
                    showLabel={false}
                    compact={true}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8 p-8">
              {/* Translation Note */}
              {(showTranslationNote || !hasTranslation) && currentLang !== 'en' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Translation not available for {supportedLanguages[currentLang].nativeName}. 
                      Showing in English.
                    </span>
                  </div>
                </div>
              )}

              {/* Definition */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Definition
                </h3>
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 rounded-xl border border-primary/20 shadow-sm">
                  <p className="text-foreground leading-relaxed text-lg font-medium">
                    {displayDefinition}
                  </p>
                </div>
              </div>

              {/* Examples */}
              {term.examples && term.examples.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Practical Applications
                  </h3>
                  <div className="space-y-3">
                    {term.examples.map((example, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-sm">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold text-lg leading-none">"</span>
                          <p className="italic text-blue-900 font-medium leading-relaxed text-base">
                            {example}
                          </p>
                          <span className="text-blue-600 font-bold text-lg leading-none">"</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Synonyms & Related Terms */}
              {(term.synonyms?.length || term.related?.length) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {term.synonyms && term.synonyms.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Tags className="w-4 h-4" />
                        Synonyms
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {term.synonyms.map((synonym, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {synonym}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {term.related && term.related.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Cross-References
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {term.related.map((related, index) => (
                          <Link 
                            key={index} 
                            to={`/lexicon/${related.toLowerCase().replace(/\s+/g, '-')}?lang=${currentLang}`}
                          >
                            <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer transition-colors">
                              {related}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Updated: {new Date(term.updated_at).toLocaleDateString()}
                  </div>
                  {term.usage_count && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Views: {term.usage_count.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};