import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Search, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
  const [term, setTerm] = useState<DictionaryTerm | null>(null);
  const [allTerms, setAllTerms] = useState<DictionaryTerm[]>([]);
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Management', 'Leadership', 'Psychology', 'Money', 'Digital Life', 'Study Skills'];

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
        .textSearch('body_text', termName)
        .limit(5);

      if (!error && data) {
        setRelatedContent(data);
      }
    } catch (error) {
      console.error('Failed to fetch related content:', error);
    }
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
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>{term.term} - TMA Dictionary</title>
          <meta name="description" content={term.short_def} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DefinedTerm",
              "name": term.term,
              "description": term.short_def,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "TMA Academy Dictionary",
                "description": "Comprehensive glossary of terms used in teenager management and leadership education"
              },
              "termCode": term.slug,
              "url": `${window.location.origin}/dictionary/${term.slug}`
            })}
          </script>
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="outline" asChild className="mb-4">
              <Link to="/dictionary" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dictionary
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-4">{term.term}</CardTitle>
                    {term.category && (
                      <Badge variant="secondary" className="mb-4">
                        {term.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Definition</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {term.long_def || term.short_def}
                  </p>
                </div>

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

                {term.translations && Object.keys(term.translations).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Translations</h3>
                    <div className="space-y-2">
                      {term.translations.ar && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Arabic (العربية)</div>
                          <div className="font-medium" dir="rtl">{term.translations.ar.term}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {term.translations.ar.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.fa && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Persian (فارسی)</div>
                          <div className="font-medium" dir="rtl">{term.translations.fa.term}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {term.translations.fa.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.es && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Spanish (Español)</div>
                          <div className="font-medium">{term.translations.es.term}</div>
                          <div className="text-sm text-muted-foreground">
                            {term.translations.es.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.fr && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">French (Français)</div>
                          <div className="font-medium">{term.translations.fr.term}</div>
                          <div className="text-sm text-muted-foreground">
                            {term.translations.fr.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.de && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">German (Deutsch)</div>
                          <div className="font-medium">{term.translations.de.term}</div>
                          <div className="text-sm text-muted-foreground">
                            {term.translations.de.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.tr && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Turkish (Türkçe)</div>
                          <div className="font-medium">{term.translations.tr.term}</div>
                          <div className="text-sm text-muted-foreground">
                            {term.translations.tr.short_def}
                          </div>
                        </div>
                      )}
                      {term.translations.ur && (
                        <div className="p-3 border rounded">
                          <div className="text-sm font-medium text-muted-foreground">Urdu (اردو)</div>
                          <div className="font-medium" dir="rtl">{term.translations.ur.term}</div>
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {term.translations.ur.short_def}
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
        <title>TMA Dictionary - Teenagers Management Academy</title>
        <meta 
          name="description" 
          content="Comprehensive dictionary of terms used in teenager management and leadership education at TMA Academy." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">TMA Dictionary</h1>
          <p className="text-xl text-muted-foreground">
            Explore key terms and concepts in teenager management and leadership education.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <Card 
              key={term.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{term.term}</h3>
                  {term.category && (
                    <Badge variant="secondary" className="text-xs">
                      {term.category}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {term.short_def}
                </p>
                
                <Button variant="outline" size="sm" asChild>
                  <Link 
                    to={`/dictionary/${term.slug}`}
                    className="flex items-center gap-1"
                  >
                    Learn More <ExternalLink className="w-3 h-3" />
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
      </div>
    </div>
  );
};

export default DictionaryPage;