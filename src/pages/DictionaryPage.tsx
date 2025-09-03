import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, ExternalLink, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { EnhancedTermCard } from '@/components/EnhancedTermCard';
import { TermDetailsModal } from '@/components/TermDetailsModal';
import { 
  Lang, 
  supportedLanguages, 
  getTextDirection, 
  getRTLClasses,
  TranslationData 
} from '@/utils/language';

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

interface Content {
  id: string;
  title: string;
  slug: string;
  published_at: string;
}

const DictionaryPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { currentLang, setLang, translate, isTranslating } = useLanguage();
  const [term, setTerm] = useState<DictionaryTerm | null>(null);
  const [allTerms, setAllTerms] = useState<DictionaryTerm[]>([]);
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [showModal, setShowModal] = useState(false);
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

      // Fetch related content
      if (data) {
        await fetchRelatedContent(data.term);
        
        // Track analytics
        await supabase.from('dictionary_analytics').insert({
          term_id: data.id,
          event_type: 'dict_term_view',
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
      // This would search for content containing the term
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

  // Handle language switching with graceful fallback
  const handleLanguageSwitch = async (lang: Lang) => {
    setLang(lang);
    setLiveTranslation(null);

    // Always return to English immediately without showing errors
    if (!term || lang === 'en') {
      return;
    }

    // For non-English languages, attempt translation silently
    if ((lang === 'ar' || lang === 'fa')) {
      // First check if we have cached translations
      if (term.translations?.[lang]) {
        return; // Use cached translation
      }
      
      // Attempt live translation silently - no error messages shown to user
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

  // Get current term display based on language
  const getCurrentTermDisplay = () => {
    if (!term) return { term: '', definition: '' };

    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || ''
      };
    }

    // Check live translation first
    if (liveTranslation) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef 
      };
    }

    // Check cached translations
    if ((currentLang === 'ar' || currentLang === 'fa') && term.translations?.[currentLang]) {
      const cached = term.translations[currentLang];
      return { 
        term: cached.term, 
        definition: cached.shortDef || cached.short_def 
      };
    }

    // Fallback to English
    return { 
      term: term.term, 
      definition: term.long_def || term.short_def || ''
    };
  };

  const filteredTerms = allTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.short_def?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || term.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dictionary...</p>
        </div>
      </div>
    );
  }

  // Single term view
  if (slug && term) {
    const { term: displayTerm, definition: displayDefinition } = getCurrentTermDisplay();
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
                "description": "Comprehensive encyclopedia of management, leadership, and psychology terms for teenagers"
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
            <Card className="dictionary-term">
              <CardHeader>
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
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {isLoading ? (
                        <div className="translation-skeleton h-8 w-64 rounded"></div>
                      ) : (
                        displayTerm
                      )}
                    </CardTitle>
                    {term.category && (
                      <Badge variant="secondary" className="mb-2">
                        {term.category}
                      </Badge>
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
              
              <CardContent className="space-y-6">
                <div className="definition">
                  <h3 className="text-lg font-semibold mb-2">Definition</h3>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="translation-skeleton h-4 w-full rounded"></div>
                      <div className="translation-skeleton h-4 w-5/6 rounded"></div>
                      <div className="translation-skeleton h-4 w-4/5 rounded"></div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {displayDefinition}
                    </p>
                  )}
                </div>

                {/* Removed translation error display - graceful fallback to English */}

                {term.synonyms && term.synonyms.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {term.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="outline">{synonym}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {term.related && term.related.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Related Terms</h3>
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
                    <h3 className="text-lg font-semibold mb-2">Appears in Articles</h3>
                    <div className="space-y-2">
                      {relatedContent.map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <h4 className="font-medium">{content.title}</h4>
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
                      ))}
                    </div>
                  </div>
                )}

                {/* Show all available translations */}
                {term.translations && Object.keys(term.translations).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Other Languages</h3>
                    <div className="space-y-2">
                      {term.translations.ar && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Arabic (العربية)</div>
                          <div className="font-medium" dir="rtl">{term.translations.ar.term}</div>
                           <div className="text-sm text-muted-foreground" dir="rtl">
                             {term.translations.ar.shortDef || term.translations.ar.short_def}
                           </div>
                        </div>
                      )}
                      {term.translations.fa && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Persian (فارسی)</div>
                          <div className="font-medium" dir="rtl">{term.translations.fa.term}</div>
                           <div className="text-sm text-muted-foreground" dir="rtl">
                             {term.translations.fa.shortDef || term.translations.fa.short_def}
                           </div>
                        </div>
                      )}
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

  // Dictionary index view
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>TMA Lexicon - Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="The comprehensive TMA Lexicon - Encyclopedia of management, leadership, psychology and entrepreneurship terms for teenagers. Trusted knowledge in multiple languages." 
        />
        <meta name="keywords" content="teenagers, management, leadership, psychology, dictionary, lexicon, multilingual, education" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "TMA Lexicon",
            "description": "Comprehensive encyclopedia of management, leadership, and psychology terms for teenagers",
            "provider": {
              "@type": "Organization",
              "name": "Teenagers Management Academy"
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-tma-blue to-tma-orange p-4 rounded-full shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-tma-blue to-tma-orange bg-clip-text text-transparent">
            TMA Lexicon
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive encyclopedia of management, leadership, psychology, and entrepreneurship. 
            Designed specifically for teenagers with multilingual support and real-world examples.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="bg-tma-cream">🇺🇸 English</Badge>
            <Badge variant="outline" className="bg-tma-cream">🇸🇦 العربية</Badge>
            <Badge variant="outline" className="bg-tma-cream">🇮🇷 فارسی</Badge>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-tma-cream to-white border-tma-blue/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-tma-blue" />
                <Input
                  placeholder="Search the TMA Lexicon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-tma-blue/30 focus:border-tma-orange"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 border-tma-blue/30">
                  <SelectValue placeholder="All disciplines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Stats Display */}
            <div className="mt-4 pt-4 border-t border-tma-blue/10">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-tma-blue rounded-full"></div>
                  {allTerms.length} total terms
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-tma-orange rounded-full"></div>
                  {categories.length} disciplines
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  3 languages supported
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <Card 
              key={term.id} 
              className="hover:shadow-lg hover:border-tma-orange/30 transition-all duration-300 cursor-pointer group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold group-hover:text-tma-orange transition-colors">
                    {term.term}
                  </h3>
                  <div className="flex flex-col items-end gap-1">
                    {term.category && (
                      <Badge variant="secondary" className="text-xs bg-tma-blue/10 text-tma-blue">
                        {term.category}
                      </Badge>
                    )}
                    {term.verification_status === 'verified' && (
                      <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {term.short_def}
                </p>
                
                {/* Discipline Tags */}
                {term.discipline_tags && term.discipline_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {term.discipline_tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-tma-cream">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="w-full group-hover:bg-tma-orange group-hover:text-white group-hover:border-tma-orange transition-all"
                >
                  <Link 
                    to={`/dictionary/${term.slug}`}
                    className="flex items-center gap-1"
                  >
                    Explore Definition <ExternalLink className="w-3 h-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No terms found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories.
            </p>
          </div>
        )}

        {/* Enhanced Term Details Modal */}
        {selectedTerm && (
          <TermDetailsModal
            term={selectedTerm}
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setSelectedTerm(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DictionaryPage;