import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import EncyclopediaTermCard from './EncyclopediaTermCard';

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

interface LexiconPaginationProps {
  terms: LexiconTerm[];
  loading: boolean;
  pageSize?: number;
  className?: string;
}

export const LexiconPagination: React.FC<LexiconPaginationProps> = ({
  terms,
  loading,
  pageSize = 24,
  className = ''
}) => {
  const [displayedTerms, setDisplayedTerms] = useState<LexiconTerm[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset pagination when terms change (e.g., new search/filter)
  useEffect(() => {
    setDisplayedTerms(terms.slice(0, pageSize));
    setCurrentPage(1);
  }, [terms, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || currentPage * pageSize >= terms.length) return;
    
    setLoadingMore(true);
    
    // Simulate loading delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * pageSize;
    
    setDisplayedTerms(terms.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
    setLoadingMore(false);
  }, [terms, currentPage, pageSize, loadingMore]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore) return;
      
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Trigger load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading, loadingMore]);

  const hasMore = currentPage * pageSize < terms.length;
  const totalPages = Math.ceil(terms.length / pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading terms...</p>
        </div>
      </div>
    );
  }

  if (displayedTerms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">No terms found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTerms.map((term) => (
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

      {/* Load More / Pagination Controls */}
      {hasMore && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Button 
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Load More Terms
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Showing {displayedTerms.length} of {terms.length} terms 
            (Page {currentPage} of {totalPages})
          </div>
        </div>
      )}

      {/* Infinite Scroll Loading Indicator */}
      {loadingMore && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading more terms...</span>
          </div>
        </div>
      )}
    </div>
  );
};