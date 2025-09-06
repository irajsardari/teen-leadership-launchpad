import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

export const LexiconNotFound: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/lexicon?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/lexicon');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Suggest similar terms based on the slug
  const suggestedTerms = [
    { term: 'Leadership', slug: 'leadership' },
    { term: 'Management', slug: 'management' },
    { term: 'Strategy', slug: 'strategy' },
    { term: 'Psychology', slug: 'psychology' },
    { term: 'Resilience', slug: 'resilience' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Term Not Found - TMA Academy Lexicon</title>
        <meta name="description" content="The requested term was not found in the TMA Academy Lexicon. Search for other terms or browse our comprehensive collection." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-8">
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Button variant="ghost" asChild>
              <Link to="/lexicon">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lexicon
              </Link>
            </Button>
          </div>

          {/* 404 Error Display */}
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <BookOpen className="w-24 h-24 text-muted-foreground/30" />
                <AlertTriangle className="w-8 h-8 text-amber-500 absolute -top-2 -right-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Term Not Found</h1>
              <div className="space-y-2">
                <p className="text-xl text-muted-foreground">
                  We couldn't find a term with the slug: <code className="bg-muted px-2 py-1 rounded text-foreground">{slug}</code>
                </p>
                <p className="text-muted-foreground">
                  The term might have been moved, renamed, or doesn't exist yet.
                </p>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search for Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search the TMA Lexicon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Try searching for leadership, management, psychology, or strategy terms
              </div>
            </CardContent>
          </Card>

          {/* Suggested Terms */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Popular Terms</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestedTerms.map((term) => (
                <Button
                  key={term.slug}
                  variant="outline"
                  asChild
                  className="hover:bg-primary/10"
                >
                  <Link to={`/lexicon/${term.slug}`}>
                    {term.term}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Help */}
          <div className="bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">Looking for something specific?</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Browse by <Link to="/lexicon" className="text-primary hover:underline">category or discipline</Link></p>
              <p>• Check our <Link to="/lexicon" className="text-primary hover:underline">complete lexicon</Link> with filters</p>
              <p>• Terms are available in multiple languages (English, Arabic, Farsi, Chinese, Hindi)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LexiconNotFound;