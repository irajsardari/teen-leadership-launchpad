import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, ExternalLink, ArrowLeft, Loader2, Globe, Volume2, CheckCircle, Clock, Tags } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  getTextDirection, 
  getRTLClasses,
  TranslationData 
} from '@/utils/language';
import LanguageSelector from '@/components/LanguageSelector';
import LexiconSearch, { SearchFilters } from '@/components/LexiconSearch';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    disciplineTag: 'all',
    difficulty: 'all',
    verified: false
  });
  const [liveTranslation, setLiveTranslation] = useState<TranslationData | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);

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

      // Track usage analytics
      if (data) {
        await Promise.all([
          // Fetch related content
          fetchRelatedContent(data.term),
          // Track analytics
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

  // Apply filters to terms
  useEffect(() => {
    let filtered = allTerms;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.short_def?.toLowerCase().includes(query) ||
        term.discipline_tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(term => term.category === filters.category);
    }

    // Apply discipline tag filter
    if (filters.disciplineTag !== 'all') {
      filtered = filtered.filter(term => 
        term.discipline_tags?.includes(filters.disciplineTag)
      );
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      if (filters.difficulty === '1-3') {
        filtered = filtered.filter(term => (term.difficulty_score || 5) <= 3);
      } else if (filters.difficulty === '4-6') {
        filtered = filtered.filter(term => {
          const score = term.difficulty_score || 5;
          return score >= 4 && score <= 6;
        });
      } else if (filters.difficulty === '7-10') {
        filtered = filtered.filter(term => (term.difficulty_score || 5) >= 7);
      }
    }

    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter(term => term.verification_status === 'verified');
    }

    setFilteredTerms(filtered);
  }, [allTerms, searchQuery, filters]);

  // Handle language switching for individual terms
  const handleLanguageSwitch = async (lang: string) => {
    setLang(lang);
    setTranslationError(null);

    if (!term) return;

    // For English, just switch - no translation needed
    if (lang === 'en') {
      setLiveTranslation(null);
      return;
    }

    // For ar/fa, attempt translation if not available
    if ((lang === 'ar' || lang === 'fa') && !term.translations?.[lang] && !liveTranslation) {
      try {
        const result = await translate(term.slug, lang);
        if (result) {
          setLiveTranslation(result);
        } else {
          setTranslationError('Translation not available yet. Please check again soon.');
        }
      } catch (error) {
        setTranslationError('Translation not available yet. Please check again soon.');
      }
    } else if (term.translations?.[lang]) {
      setLiveTranslation(null); // Clear live translation to use cached
    }
  };

  // Get current term display based on language
  const getCurrentTermDisplay = () => {
    if (!term) return { term: '', definition: '' };

    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || '',
        phonetic: term.phonetic_en
      };
    }

    // Check live translation first
    if (liveTranslation) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    // Check cached translations
    if ((currentLang === 'ar' || currentLang === 'fa') && term.translations?.[currentLang]) {
      const cached = term.translations[currentLang];
      return { 
        term: cached.term, 
        definition: cached.shortDef || cached.short_def,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    // Fallback to English
    return { 
      term: term.term, 
      definition: term.long_def || term.short_def || '',
      phonetic: term.phonetic_en
    };
  };

  // Get all unique discipline tags for filtering
  const allTags = Array.from(
    new Set(
      allTerms.flatMap(term => term.discipline_tags || [])
    )
  ).sort();

  const filteredTerms = allTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.short_def?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.discipline_tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || term.category === filterCategory;
    const matchesTag = filterTag === 'all' || term.discipline_tags?.includes(filterTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

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
    const needsTranslation = (currentLang === 'ar' || currentLang === 'fa') && 
      !term.translations?.[currentLang] && !liveTranslation;
    const isLoading = needsTranslation && isTranslating;

    return (
      <div className="min-h-screen bg-background" dir={textDirection}>
        <Helmet>
          <title>{displayTerm} - TMA Lexicon</title>
          <meta name="description" content={displayDefinition.substring(0, 160)} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DefinedTerm",
              "name": term.term,
              "alternateName": Object.values(term.translations || {}).map((t: any) => t.term),
              "description": term.short_def,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "TMA Lexicon",
                "description": "Teenager Management Academy educational lexicon"
              }
            })}
          </script>
        </Helmet>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dictionary" className={`flex items-center gap-2 ${currentLang === 'ar' || currentLang === 'fa' ? 'flex-row-reverse' : ''}`}>
                <ArrowLeft className={`w-4 h-4 ${currentLang === 'ar' || currentLang === 'fa' ? 'flip-rtl' : ''}`} />
                Back to TMA Lexicon
              </Link>
            </Button>
          </div>

          <div className={`space-y-6 ${rtlClasses}`}>
            <Card className="lexicon-term border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                {/* Language Selector */}
                <div className="lang-selector mb-6">
                  <button
                    data-lang="en"
                    onClick={() => handleLanguageSwitch('en')}
                    className={currentLang === 'en' ? 'active' : ''}
                    disabled={isTranslating}
                  >
                    English
                  </button>
                  <button
                    data-lang="ar"
                    onClick={() => handleLanguageSwitch('ar')}
                    className={currentLang === 'ar' ? 'active' : ''}
                    disabled={isTranslating}
                  >
                    {isTranslating && currentLang === 'ar' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'العربية'
                    )}
                  </button>
                  <button
                    data-lang="fa"
                    onClick={() => handleLanguageSwitch('fa')}
                    className={currentLang === 'fa' ? 'active' : ''}
                    disabled={isTranslating}
                  >
                    {isTranslating && currentLang === 'fa' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'فارسی'
                    )}
                  </button>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-3 text-primary font-bold">
                      {isLoading ? (
                        <div className="translation-skeleton h-8 w-64 rounded"></div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {displayTerm}
                          {phonetic && (
                            <span className="text-lg text-muted-foreground font-normal">
                              /{phonetic}/
                            </span>
                          )}
                        </div>
                      )}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {term.category && (
                        <Badge variant="default" className="bg-primary text-white">
                          {term.category}
                        </Badge>
                      )}
                      {term.verification_status === 'verified' && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified by TMA
                        </Badge>
                      )}
                      {term.usage_count && term.usage_count > 0 && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Views: {term.usage_count}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Discipline Tags */}
                    {term.discipline_tags && term.discipline_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        <Tags className="w-4 h-4 text-muted-foreground mt-0.5" />
                        {term.discipline_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {supportedLanguages[currentLang].nativeName}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                <div className="definition">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Definition</h3>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="translation-skeleton h-4 w-full rounded"></div>
                      <div className="translation-skeleton h-4 w-5/6 rounded"></div>
                      <div className="translation-skeleton h-4 w-4/5 rounded"></div>
                    </div>
                  ) : (
                    <p className="text-foreground leading-relaxed text-base">
                      {displayDefinition}
                    </p>
                  )}
                </div>

                {translationError && (
                  <div className="translation-error bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <p className="text-yellow-800 text-sm">
                      Auto-translate failed. Showing English version.
                    </p>
                  </div>
                )}

                {/* Examples */}
                {term.examples && term.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Examples</h3>
                    <div className="space-y-2">
                      {term.examples.map((example, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded border-l-4 border-primary/50">
                          <p className="text-sm italic">"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {term.synonyms && term.synonyms.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {term.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="outline">{synonym}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {term.related && term.related.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Related Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {term.related.map((relatedSlug, index) => (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <Link to={`/dictionary/${relatedSlug}`}>
                            {relatedSlug.replace('-', ' ')}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {relatedContent.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Appears in Articles</h3>
                    <div className="space-y-3">
                      {relatedContent.map((content) => (
                        <Card key={content.id} className="border-l-4 border-primary/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-foreground">{content.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Published: {new Date(content.published_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link 
                                  to={`/article/${content.slug}`}
                                  className="flex items-center gap-1"
                                >
                                  Read <ExternalLink className="w-3 h-3" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show all available translations */}
                {term.translations && Object.keys(term.translations).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Other Languages</h3>
                    <div className="space-y-3">
                      {term.translations.ar && (
                        <Card className="p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">Arabic (العربية)</div>
                          <div className="font-medium text-lg mb-1" dir="rtl">{term.translations.ar.term}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {term.translations.ar.shortDef || term.translations.ar.short_def}
                          </div>
                        </Card>
                      )}
                      {term.translations.fa && (
                        <Card className="p-4">
                          <div className="text-sm font-medium text-muted-foreground mb-1">Persian (فارسی)</div>
                          <div className="font-medium text-lg mb-1" dir="rtl">{term.translations.fa.term}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {term.translations.fa.shortDef || term.translations.fa.short_def}
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                {/* Sources */}
                {term.sources && term.sources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Sources</h3>
                    <div className="space-y-2">
                      {term.sources.map((source, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {index + 1}. {source}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Lexicon index view
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>TMA Lexicon - Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="The comprehensive TMA Lexicon: your authoritative source for management, leadership, and psychology terms tailored for teenagers and educators." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 text-primary">TMA Lexicon</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive encyclopedia of management, leadership, and psychology terms — 
            designed specifically for teenagers, parents, and educators.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              <BookOpen className="w-3 h-3 mr-1" />
              {allTerms.length} Terms
            </Badge>
            <Badge variant="outline">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified by TMA Academy
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms, definitions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(searchTerm || filterCategory !== 'all' || filterTag !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTerms.length} of {allTerms.length} terms
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterTag('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <Card key={term.id} className="hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-primary hover:text-primary/80 transition-colors">
                    <Link to={`/dictionary/${term.slug}`}>
                      {term.term}
                    </Link>
                  </CardTitle>
                  <div className="flex flex-col gap-1">
                    {term.verification_status === 'verified' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {term.usage_count && term.usage_count > 10 && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {term.category && (
                    <Badge variant="default" className="bg-primary/10 text-primary">
                      {term.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {term.short_def}
                </p>
                
                {term.discipline_tags && term.discipline_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {term.discipline_tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {term.discipline_tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{term.discipline_tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to={`/dictionary/${term.slug}`}>
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No terms found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LexiconPage;