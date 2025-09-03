import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Loader2, Globe, CheckCircle, Clock, Tags, Users, TrendingUp, Volume2, Bookmark, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  phonetic_ar?: string;
  phonetic_fa?: string;
  examples?: string[];
  discipline_tags?: string[];
  sources?: string[];
  verification_status?: string;
  usage_count?: number;
  difficulty_score?: number;
  created_at: string;
  updated_at: string;
}

interface Content {
  id: string;
  title: string;
  slug: string;
  published_at: string;
}

const LexiconPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { currentLang, setLang, translate, isTranslating } = useLanguage();
  const [term, setTerm] = useState<LexiconTerm | null>(null);
  const [allTerms, setAllTerms] = useState<LexiconTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<LexiconTerm[]>([]);
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    category: 'all',
    disciplineTag: 'all',
    difficulty: 'all',
    verified: false
  });
  const [liveTranslation, setLiveTranslation] = useState<TranslationData | null>(null);
  // Removed translationError state - using silent fallback only

  const categories = ['Management', 'Leadership', 'Psychology', 'Finance', 'Digital Life', 'Study Skills', 'Communication', 'Sociology', 'Philosophy', 'Ethics'];

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
        await Promise.all([
          fetchRelatedContent(data.term),
          supabase.from('dictionary_analytics').insert({
            term_id: data.id,
            event_type: 'lexicon_term_view',
            from_article: false
          })
        ]);
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

  const fetchRelatedContent = async (termName: string) => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('id, title, slug, published_at')
        .eq('status', 'published')
        .ilike('body_text', `%${termName}%`)
        .limit(5);

      if (!error && data) {
        setRelatedContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch related content:', error);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = allTerms;

    // Apply search filters using the same logic as LexiconSearch
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
    setLiveTranslation(null); // Reset live translation

    // Always return to English immediately without showing errors
    if (!term || lang === 'en') {
      return;
    }

    // For non-English languages, attempt translation
    if ((lang === 'ar' || lang === 'fa')) {
      // First check if we have cached translations
      if (term.translations?.[lang]) {
        return; // Use cached translation
      }
      
      // Attempt live translation silently
      try {
        const result = await translate(term.slug, lang);
        if (result) {
          setLiveTranslation(result);
        }
        // If translation fails, we simply stay in English - no error shown
      } catch (error) {
        // Silent fail - stay in English view
        console.log(`Translation not available for ${lang}, staying in English`);
      }
    }
  };

  const getCurrentTermDisplay = () => {
    if (!term) return { term: '', definition: '', phonetic: '' };

    // Always try to display in the selected language, fallback to English gracefully
    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || '',
        phonetic: term.phonetic_en
      };
    }

    // For non-English languages, try live translation first, then cached, then fallback to English
    if (liveTranslation && (currentLang === 'ar' || currentLang === 'fa')) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    if ((currentLang === 'ar' || currentLang === 'fa') && term.translations?.[currentLang]) {
      const cached = term.translations[currentLang];
      return { 
        term: cached.term || cached.translated_term, 
        definition: cached.shortDef || cached.short_def || cached.definition,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    // Graceful fallback to English - no error message
    return { 
      term: term.term, 
      definition: term.long_def || term.short_def || '',
      phonetic: term.phonetic_en
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
    const { term: displayTerm, definition: displayDefinition, phonetic } = getCurrentTermDisplay();
    const textDirection = getTextDirection(currentLang);
    const rtlClasses = getRTLClasses(currentLang);

    return (
      <div className="min-h-screen bg-background" dir={textDirection}>
        <Helmet>
          <title>{displayTerm} - TMA Lexicon</title>
          <meta name="description" content={displayDefinition.substring(0, 160)} />
        </Helmet>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dictionary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to TMA Encyclopedia
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
                      {phonetic && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-muted-foreground font-mono">
                            /{phonetic}/
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => playPronunciation(displayTerm)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
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
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bookmark className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 p-8">
                {/* Definition */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Definition
                  </h3>
                   <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 rounded-xl border border-primary/20 shadow-sm">
                     <p className="text-foreground leading-relaxed text-lg font-medium line-height-7">
                       {displayDefinition}
                     </p>
                   </div>
                </div>

                {/* Examples */}
                {term.examples && term.examples.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      Practical Examples
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
                            <Badge key={index} variant="outline" className="text-sm">
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                 {/* Academic Metadata */}
                 <div className="bg-muted/10 p-6 rounded-xl border border-muted/30">
                   <h4 className="text-lg font-semibold mb-4 text-primary">Academic Information</h4>
                   <div className="grid md:grid-cols-2 gap-4 text-sm">
                     {term.usage_count && (
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <TrendingUp className="w-4 h-4" />
                         <span><strong>{term.usage_count}</strong> academic references</span>
                       </div>
                     )}
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <Clock className="w-4 h-4" />
                       <span>Last reviewed: <strong>{new Date(term.updated_at).toLocaleDateString()}</strong></span>
                     </div>
                     {term.sources && term.sources.length > 0 && (
                       <div className="flex items-center gap-2 text-muted-foreground">
                         <BookOpen className="w-4 h-4" />
                         <span><strong>{term.sources.length}</strong> source(s) cited</span>
                       </div>
                     )}
                     {term.verification_status === 'verified' && (
                       <div className="flex items-center gap-2 text-green-600">
                         <CheckCircle className="w-4 h-4" />
                         <span><strong>Academically verified</strong></span>
                       </div>
                     )}
                   </div>
                 </div>

                {/* Remove the translation error display completely since we fallback gracefully */}
              </CardContent>
            </Card>

            {/* Related Content */}
            {relatedContent.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {relatedContent.map((content) => (
                      <Link
                        key={content.id}
                        to={`/blog/${content.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium">{content.title}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Encyclopedia index view
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Helmet>
        <title>TMA Encyclopedia - Comprehensive Management & Leadership Reference</title>
        <meta name="description" content="Professional encyclopedia covering management, leadership, psychology, entrepreneurship, and related disciplines with multilingual support." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-primary">TMA Encyclopedia</h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Your comprehensive multilingual reference for management, leadership, psychology, 
            entrepreneurship, and related disciplines. Access thousands of professionally 
            curated terms with expert definitions, phonetic guides, and practical examples—all 
            verified by TMA Academy's academic standards.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/30">{allTerms.length}+</Badge>
              <span className="font-medium">Academic Terms</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 border-green-200">{Object.keys(supportedLanguages).length}</Badge>
              <span className="font-medium">Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 border-blue-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                TMA Verified
              </Badge>
              <span className="font-medium">by Experts</span>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <LanguageSelector
            currentLang={currentLang}
            onLanguageChange={handleLanguageSwitch}
            isTranslating={isTranslating}
            showLabel={true}
            compact={false}
          />
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-primary/20">
          <CardContent className="p-6">
            <LexiconSearch
              terms={allTerms}
              onSearch={handleSearch}
              onFilterChange={setSearchFilters}
              currentFilters={searchFilters}
            />
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">
              Encyclopedia Entries
            </h2>
            <Badge variant="outline" className="text-sm">
              {filteredTerms.length} {filteredTerms.length === 1 ? 'result' : 'results'}
            </Badge>
          </div>
          
          {filteredTerms.length !== allTerms.length && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchFilters({
                  category: 'all',
                  disciplineTag: 'all', 
                  difficulty: 'all',
                  verified: false
                });
                handleSearch('');
              }}
            >
              Show All Terms
            </Button>
          )}
        </div>

        {/* Terms Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <EncyclopediaTermCard
                key={term.id}
                term={term}
                showPhonetics={true}
                showUsageCount={true}
                compact={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No terms found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available terms.
            </p>
            <Button 
              onClick={() => {
                setSearchFilters({
                  category: 'all',
                  disciplineTag: 'all', 
                  difficulty: 'all',
                  verified: false
                });
                handleSearch('');
              }}
            >
              View All Terms
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {allTerms.filter(t => t.verification_status === 'verified').length}+
                  </div>
                  <div className="text-sm text-muted-foreground">Verified Terms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Array.from(new Set(allTerms.map(t => t.category))).length}+
                  </div>
                  <div className="text-sm text-muted-foreground">Disciplines</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Object.keys(supportedLanguages).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LexiconPage;