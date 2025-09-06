import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Loader2, Globe, CheckCircle, Tags, Volume2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  getTextDirection, 
  getRTLClasses,
  TranslationData,
  Lang,
  supportedLanguages
} from '@/utils/language';
import LexiconSearch, { SearchFilters } from '@/components/LexiconSearch';
import EncyclopediaTermCard from '@/components/lexicon/EncyclopediaTermCard';
import LanguageSelector from '@/components/lexicon/LanguageSelector';

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

const PublicLexiconPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { currentLang, setLang, translate, isTranslating } = useLanguage();
  const [term, setTerm] = useState<LexiconTerm | null>(null);
  const [allTerms, setAllTerms] = useState<LexiconTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<LexiconTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: 'all',
    disciplineTag: 'all',
    difficulty: 'all',
    verified: false
  });
  const [liveTranslation, setLiveTranslation] = useState<TranslationData | null>(null);
  const [showTranslationNote, setShowTranslationNote] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchTerm();
    } else {
      fetchAllTerms();
    }
  }, [slug]);

  const fetchTerm = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setTerm(data);

      if (data) {
        await supabase.from('dictionary_analytics').insert({
          term_id: data.id,
          event_type: 'lexicon_term_view',
          from_article: false
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch term: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('status', 'published')
        .order('usage_count', { ascending: false })
        .order('term');

      if (error) throw error;
      setAllTerms(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch terms: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = allTerms;

    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(term => term.category === searchFilters.category);
    }

    if (searchFilters.disciplineTag !== 'all') {
      filtered = filtered.filter(term => 
        term.discipline_tags?.includes(searchFilters.disciplineTag)
      );
    }

    if (searchFilters.difficulty !== 'all') {
      const [min, max] = searchFilters.difficulty === '1-3' ? [1, 3] :
                         searchFilters.difficulty === '4-6' ? [4, 6] :
                         searchFilters.difficulty === '7-10' ? [7, 10] : [0, 10];
      filtered = filtered.filter(term => {
        const score = term.difficulty_score || 5;
        return score >= min && score <= max;
      });
    }

    if (searchFilters.verified) {
      filtered = filtered.filter(term => term.verification_status === 'verified');
    }

    setFilteredTerms(filtered);
  }, [allTerms, searchFilters]);

  const handleSearch = (query: string) => {
    let filtered = allTerms;

    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(searchTerm) ||
        term.short_def?.toLowerCase().includes(searchTerm) ||
        term.discipline_tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters
    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(term => term.category === searchFilters.category);
    }

    if (searchFilters.disciplineTag !== 'all') {
      filtered = filtered.filter(term => 
        term.discipline_tags?.includes(searchFilters.disciplineTag)
      );
    }

    if (searchFilters.difficulty !== 'all') {
      const [min, max] = searchFilters.difficulty === '1-3' ? [1, 3] :
                         searchFilters.difficulty === '4-6' ? [4, 6] :
                         searchFilters.difficulty === '7-10' ? [7, 10] : [0, 10];
      filtered = filtered.filter(term => {
        const score = term.difficulty_score || 5;
        return score >= min && score <= max;
      });
    }

    if (searchFilters.verified) {
      filtered = filtered.filter(term => term.verification_status === 'verified');
    }

    setFilteredTerms(filtered);
  };

  const handleLanguageSwitch = async (lang: Lang) => {
    setLang(lang);
    setLiveTranslation(null);
    setShowTranslationNote(false);

    if (!term || lang === 'en') {
      return;
    }

    // Check if we have cached translations
    if (term.translations?.[lang]) {
      return;
    }
    
    // For supported translation languages, attempt translation
    if (lang === 'ar' || lang === 'fa') {
      try {
        const result = await translate(term.slug, lang);
        if (result) {
          setLiveTranslation(result);
        } else {
          setShowTranslationNote(true);
        }
      } catch (error) {
        setShowTranslationNote(true);
      }
    } else {
      // For Chinese and Hindi, show note that translation is not available yet
      setShowTranslationNote(true);
    }
  };

  const getCurrentTermDisplay = () => {
    if (!term) return { term: '', definition: '', hasTranslation: true };

    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || '',
        hasTranslation: true
      };
    }

    // Try live translation first
    if (liveTranslation && (currentLang === 'ar' || currentLang === 'fa')) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef,
        hasTranslation: true
      };
    }

    // Try cached translations
    if ((currentLang === 'ar' || currentLang === 'fa') && term.translations?.[currentLang]) {
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
      speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading TMA Lexicon...</p>
        </div>
      </div>
    );
  }

  // Single term view
  if (slug && term) {
    const { term: displayTerm, definition: displayDefinition, hasTranslation } = getCurrentTermDisplay();
    const textDirection = getTextDirection(currentLang);
    const rtlClasses = getRTLClasses(currentLang);

    return (
      <div className="min-h-screen bg-background" dir={textDirection}>
        <Helmet>
          <title>{displayTerm} - TMA Academy Lexicon</title>
          <meta name="description" content={displayDefinition.substring(0, 160)} />
          <meta name="keywords" content={`${displayTerm}, leadership, management, TMA Academy`} />
        </Helmet>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/lexicon">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lexicon
              </Link>
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
                      onLanguageChange={handleLanguageSwitch}
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
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      Examples
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
                        <h4 className="text-lg font-semibold mb-3">Synonyms</h4>
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
                        <h4 className="text-lg font-semibold mb-3">Related Terms</h4>
                        <div className="flex flex-wrap gap-2">
                          {term.related.map((related, index) => (
                            <Link 
                              key={index} 
                              to={`/lexicon/${related.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer">
                                {related}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main lexicon index view
  const textDirection = getTextDirection(currentLang);
  const rtlClasses = getRTLClasses(currentLang);

  return (
    <div className="min-h-screen bg-background" dir={textDirection}>
      <Helmet>
        <title>TMA Academy Lexicon - Leadership & Management Terms</title>
        <meta name="description" content="Explore comprehensive definitions of leadership, management, and psychology terms from TMA Academy. Available in multiple languages." />
        <meta name="keywords" content="leadership lexicon, management terms, psychology definitions, TMA Academy" />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className={`space-y-8 ${rtlClasses}`}>
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-primary">TMA Academy Lexicon</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive definitions and explanations of key leadership, management, and psychology terms used at TMA Academy.
            </p>
            
            {/* Language Selector */}
            <div className="flex justify-center">
              <LanguageSelector
                currentLang={currentLang}
                onLanguageChange={handleLanguageSwitch}
                isTranslating={isTranslating}
                showLabel={true}
                compact={false}
              />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <LexiconSearch
              terms={allTerms}
              onSearch={handleSearch}
              onFilterChange={setSearchFilters}
              currentFilters={searchFilters}
            />
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing {filteredTerms.length} of {allTerms.length} terms
            </div>
            {(searchFilters.category !== 'all' || searchFilters.disciplineTag !== 'all' || 
              searchFilters.difficulty !== 'all' || searchFilters.verified) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchFilters({ category: 'all', disciplineTag: 'all', difficulty: 'all', verified: false })}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Terms Grid */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTerms.map((term) => (
                <Link key={term.id} to={`/lexicon/${term.slug}`}>
                  <EncyclopediaTermCard 
                    term={term}
                    showPhonetics={false}
                    showUsageCount={true}
                    compact={false}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No terms found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{allTerms.length}</div>
                <div className="text-sm text-muted-foreground">Total Terms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {allTerms.filter(t => t.verification_status === 'verified').length}
                </div>
                <div className="text-sm text-muted-foreground">Verified Terms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{Object.keys(supportedLanguages).length}</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLexiconPage;