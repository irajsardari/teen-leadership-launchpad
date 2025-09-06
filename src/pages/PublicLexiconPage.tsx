import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
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
import { TermDetailView } from '@/components/lexicon/TermDetailView';
import { LexiconPagination } from '@/components/lexicon/LexiconPagination';
import { SEOHead } from '@/components/lexicon/SEOHead';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [termNotFound, setTermNotFound] = useState(false);

  // Initialize language from URL params
  useEffect(() => {
    const langParam = searchParams.get('lang') as Lang;
    if (langParam && supportedLanguages[langParam]) {
      setLang(langParam);
    }
  }, [searchParams, setLang]);

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
      setTermNotFound(false);
      const { data, error } = await supabase
        .from('dictionary')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - term not found
          setTermNotFound(true);
          return;
        }
        throw error;
      }
      
      setTerm(data);
      setTermNotFound(false);

      if (data) {
        await supabase.from('dictionary_analytics').insert({
          term_id: data.id,
          event_type: 'lexicon_term_view',
          from_article: false
        });
      }
    } catch (error: any) {
      console.error('Error fetching term:', error);
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
      filtered = filtered.filter(term => {
        // Search in English term and definition
        const englishMatch = term.term.toLowerCase().includes(searchTerm) ||
                           term.short_def?.toLowerCase().includes(searchTerm) ||
                           term.long_def?.toLowerCase().includes(searchTerm) ||
                           term.discipline_tags?.some(tag => tag.toLowerCase().includes(searchTerm));
        
        // Search in translations if they exist
        const translationMatch = term.translations && Object.values(term.translations).some((translation: any) => {
          if (!translation) return false;
          return (translation.term?.toLowerCase().includes(searchTerm) ||
                  translation.shortDef?.toLowerCase().includes(searchTerm) ||
                  translation.short_def?.toLowerCase().includes(searchTerm) ||
                  translation.definition?.toLowerCase().includes(searchTerm));
        });
        
        return englishMatch || translationMatch;
      });
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

    // Update URL with language parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (lang !== 'en') {
      newSearchParams.set('lang', lang);
    } else {
      newSearchParams.delete('lang');
    }
    setSearchParams(newSearchParams);

    if (!term || lang === 'en') {
      return;
    }

    // Check if we have cached translations
    if (term.translations?.[lang]) {
      return;
    }
    
    // Attempt translation for all supported languages
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

  // Handle term not found
  if (slug && termNotFound) {
    // Redirect to 404 page with the slug
    navigate(`/lexicon-not-found/${slug}`, { replace: true });
    return null;
  }

  // Single term view
  if (slug && term) {
    return (
      <TermDetailView
        term={term}
        currentLang={currentLang}
        onLanguageChange={handleLanguageSwitch}
        isTranslating={isTranslating}
        liveTranslation={liveTranslation}
        showTranslationNote={showTranslationNote}
      />
    );
  }

  // Main lexicon index view
  const textDirection = getTextDirection(currentLang);
  const rtlClasses = getRTLClasses(currentLang);

  // SEO data for the main lexicon page
  const currentUrl = `${window.location.origin}/lexicon`;
  const alternateLanguages = Object.keys(supportedLanguages).map(lang => ({
    lang: lang as Lang,
    url: `${currentUrl}?lang=${lang}`
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "TMA Academy Lexicon",
    "description": "Comprehensive definitions and explanations of key leadership, management, and psychology terms from TMA Academy",
    "url": currentUrl,
    "inLanguage": Object.keys(supportedLanguages),
    "publisher": {
      "@type": "Organization",
      "name": "TMA Academy",
      "url": window.location.origin
    },
    "about": [
      { "@type": "Thing", "name": "Leadership" },
      { "@type": "Thing", "name": "Management" },
      { "@type": "Thing", "name": "Psychology" }
    ]
  };

  return (
    <div className="min-h-screen bg-background" dir={textDirection}>
      <SEOHead
        title="TMA Academy Lexicon - Leadership & Management Terms"
        description="Explore comprehensive definitions of leadership, management, and psychology terms from TMA Academy. Available in multiple languages."
        url={currentUrl}
        lang={currentLang}
        alternateLanguages={alternateLanguages}
        jsonLd={jsonLd}
      />

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

          {/* Terms with Pagination */}
          <LexiconPagination
            terms={filteredTerms}
            loading={loading}
            pageSize={24}
          />

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