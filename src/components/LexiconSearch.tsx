import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, BookOpen, Tags, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LexiconTerm {
  id: string;
  term: string;
  slug: string;
  short_def: string;
  category: string;
  discipline_tags?: string[];
  difficulty_score?: number;
  usage_count?: number;
  verification_status?: string;
}

interface LexiconSearchProps {
  terms: LexiconTerm[];
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
  className?: string;
}

export interface SearchFilters {
  category: string;
  disciplineTag: string;
  difficulty: string;
  verified: boolean;
}

export const LexiconSearch: React.FC<LexiconSearchProps> = ({
  terms,
  onSearch,
  onFilterChange,
  currentFilters,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const navigate = useNavigate();

  // Get unique values for filters
  const categories = useMemo(() => 
    Array.from(new Set(terms.map(term => term.category))).sort(),
    [terms]
  );

  const disciplineTags = useMemo(() => 
    Array.from(new Set(
      terms.flatMap(term => term.discipline_tags || [])
    )).sort(),
    [terms]
  );

  // Filter terms for autocomplete
  const filteredTerms = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    return terms
      .filter(term => 
        term.term.toLowerCase().includes(query) ||
        term.short_def.toLowerCase().includes(query) ||
        term.discipline_tags?.some(tag => tag.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        // Prioritize exact matches at the beginning
        const aExact = a.term.toLowerCase().startsWith(query);
        const bExact = b.term.toLowerCase().startsWith(query);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then by usage count
        return (b.usage_count || 0) - (a.usage_count || 0);
      })
      .slice(0, 8);
  }, [searchQuery, terms]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
    setShowAutocomplete(value.length >= 2);
  };

  const handleTermSelect = (term: LexiconTerm) => {
    navigate(`/lexicon/${term.slug}`);
    setSearchQuery('');
    setShowAutocomplete(false);
    setAutocompleteOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setShowAutocomplete(false);
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      disciplineTag: 'all',
      difficulty: 'all',
      verified: false
    });
  };

  const hasActiveFilters = currentFilters.category !== 'all' || 
                          currentFilters.disciplineTag !== 'all' || 
                          currentFilters.difficulty !== 'all' || 
                          currentFilters.verified;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search the TMA Lexicon... (try 'leadership', 'strategy', or 'psychology')"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowAutocomplete(searchQuery.length >= 2)}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showAutocomplete && filteredTerms.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Quick suggestions</span>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredTerms.map((term) => (
                <button
                  key={term.id}
                  onClick={() => handleTermSelect(term)}
                  className="w-full text-left p-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">
                          {term.term}
                        </span>
                        {term.verification_status === 'verified' && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {term.short_def}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {term.category}
                        </Badge>
                        {term.discipline_tags?.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {term.difficulty_score && (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  i < (term.difficulty_score || 0) / 2 
                                    ? 'bg-primary' 
                                    : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>

        {/* Category Filter */}
        <Select
          value={currentFilters.category}
          onValueChange={(value) => onFilterChange({ ...currentFilters, category: value })}
        >
          <SelectTrigger className="w-auto min-w-[140px] h-8">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Discipline Tag Filter */}
        <Select
          value={currentFilters.disciplineTag}
          onValueChange={(value) => onFilterChange({ ...currentFilters, disciplineTag: value })}
        >
          <SelectTrigger className="w-auto min-w-[140px] h-8">
            <SelectValue placeholder="Discipline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disciplines</SelectItem>
            {disciplineTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                <div className="flex items-center gap-2">
                  <Tags className="w-3 h-3" />
                  {tag}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={currentFilters.difficulty}
          onValueChange={(value) => onFilterChange({ ...currentFilters, difficulty: value })}
        >
          <SelectTrigger className="w-auto min-w-[120px] h-8">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1-3">Beginner (1-3)</SelectItem>
            <SelectItem value="4-6">Intermediate (4-6)</SelectItem>
            <SelectItem value="7-10">Advanced (7-10)</SelectItem>
          </SelectContent>
        </Select>

        {/* Verified Filter */}
        <Button
          variant={currentFilters.verified ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange({ ...currentFilters, verified: !currentFilters.verified })}
          className="h-8"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Verified
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {currentFilters.category !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {currentFilters.category}
              <button
                onClick={() => onFilterChange({ ...currentFilters, category: 'all' })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {currentFilters.disciplineTag !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tags className="w-3 h-3" />
              {currentFilters.disciplineTag}
              <button
                onClick={() => onFilterChange({ ...currentFilters, disciplineTag: 'all' })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {currentFilters.difficulty !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Difficulty: {currentFilters.difficulty}
              <button
                onClick={() => onFilterChange({ ...currentFilters, difficulty: 'all' })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {currentFilters.verified && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Verified
              <button
                onClick={() => onFilterChange({ ...currentFilters, verified: false })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default LexiconSearch;