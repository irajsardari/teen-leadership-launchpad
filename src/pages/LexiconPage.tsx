import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, ExternalLink, ArrowLeft, Loader2, Globe, CheckCircle, Clock, Tags } from 'lucide-react';
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
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

  // Apply filters
  useEffect(() => {
    let filtered = allTerms;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.short_def?.toLowerCase().includes(query) ||
        term.discipline_tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(term => term.category === filterCategory);
    }

    if (filterTag !== 'all') {
      filtered = filtered.filter(term => 
        term.discipline_tags?.includes(filterTag)
      );
    }

    setFilteredTerms(filtered);
  }, [allTerms, searchQuery, filterCategory, filterTag]);

  const handleLanguageSwitch = async (lang: Lang) => {
    setLang(lang);
    setTranslationError(null);

    if (!term || lang === 'en') {
      setLiveTranslation(null);
      return;
    }

    if ((lang === 'ar' || lang === 'fa') && !term.translations?.[lang] && !liveTranslation) {
      try {
        const result = await translate(term.slug, lang);
        if (result) {
          setLiveTranslation(result);
        } else {
          setTranslationError('Translation not available yet.');
        }
      } catch (error) {
        setTranslationError('Translation not available yet.');
      }
    } else if (term.translations?.[lang]) {
      setLiveTranslation(null);
    }
  };

  const getCurrentTermDisplay = () => {
    if (!term) return { term: '', definition: '' };

    if (currentLang === 'en') {
      return { 
        term: term.term, 
        definition: term.long_def || term.short_def || '',
        phonetic: term.phonetic_en
      };
    }

    if (liveTranslation) {
      return { 
        term: liveTranslation.term, 
        definition: liveTranslation.shortDef,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    if ((currentLang === 'ar' || currentLang === 'fa') && term.translations?.[currentLang]) {
      const cached = term.translations[currentLang];
      return { 
        term: cached.term, 
        definition: cached.shortDef || cached.short_def,
        phonetic: currentLang === 'ar' ? term.phonetic_ar : term.phonetic_fa
      };
    }

    return { 
      term: term.term, 
      definition: term.long_def || term.short_def || '',
      phonetic: term.phonetic_en
    };
  };

  const allTags = Array.from(
    new Set(allTerms.flatMap(term => term.discipline_tags || []))
  ).sort();

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

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dictionary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to TMA Lexicon
              </Link>
            </Button>
          </div>

          <div className={`space-y-6 ${rtlClasses}`}>
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-3 text-primary font-bold">
                      <div className="flex items-center gap-3">
                        {displayTerm}
                        {phonetic && (
                          <span className="text-lg text-muted-foreground font-normal">
                            /{phonetic}/
                          </span>
                        )}
                      </div>
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
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {supportedLanguages[currentLang as Lang].nativeName}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">Definition</h3>
                  <p className="text-foreground leading-relaxed text-base">
                    {displayDefinition}
                  </p>
                </div>

                {translationError && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <p className="text-yellow-800 text-sm">{translationError}</p>
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
        <title>TMA Lexicon - Educational Dictionary</title>
        <meta name="description" content="Comprehensive educational lexicon covering leadership, management, psychology, and life skills terminology." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">TMA Lexicon</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive educational dictionary covering essential terms in leadership, management, 
            psychology, and life skills development.
          </p>
        </div>

        <Card className="mb-8 shadow-lg border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <Link key={term.id} to={`/dictionary/${term.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {term.term}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {term.short_def}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{term.category}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LexiconPage;