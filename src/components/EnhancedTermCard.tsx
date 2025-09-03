import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Volume2 } from 'lucide-react';

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

interface EnhancedTermCardProps {
  term: DictionaryTerm;
  onClick: () => void;
}

export const EnhancedTermCard: React.FC<EnhancedTermCardProps> = ({ term, onClick }) => {
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-border bg-card cursor-pointer hover:border-tma-orange/50"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold group-hover:text-tma-orange transition-colors mb-1">
              {term.term}
            </h3>
            {term.phonetic_en && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">/{term.phonetic_en}/</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 hover:bg-tma-orange/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Audio playback functionality can be added here
                  }}
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
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

        {/* Example sentence preview */}
        {term.examples && term.examples.length > 0 && (
          <div className="mb-4 p-3 bg-tma-cream/30 rounded-lg border-l-2 border-tma-orange">
            <p className="text-sm italic text-muted-foreground">
              "{term.examples[0]}"
            </p>
          </div>
        )}
        
        {/* Discipline Tags */}
        {term.discipline_tags && term.discipline_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {term.discipline_tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-tma-cream">
                {tag}
              </Badge>
            ))}
            {term.discipline_tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted">
                +{term.discipline_tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="group-hover:bg-tma-orange group-hover:text-white group-hover:border-tma-orange transition-all"
          >
            <span className="flex items-center gap-1">
              View Details <ExternalLink className="w-3 h-3" />
            </span>
          </Button>
          
          {term.translations && (
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">🇸🇦</Badge>
              <Badge variant="outline" className="text-xs">🇮🇷</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};