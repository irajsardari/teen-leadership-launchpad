import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Tags, 
  TrendingUp,
  ExternalLink,
  Volume2,
  Eye
} from 'lucide-react';

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
  phonetic_en?: string;
  examples?: string[];
  created_at: string;
  updated_at: string;
}

interface EncyclopediaTermCardProps {
  term: LexiconTerm;
  showPhonetics?: boolean;
  showUsageCount?: boolean;
  compact?: boolean;
}

const EncyclopediaTermCard: React.FC<EncyclopediaTermCardProps> = ({ 
  term, 
  showPhonetics = true,
  showUsageCount = true,
  compact = false 
}) => {
  const getDifficultyLabel = (score?: number) => {
    if (!score) return null;
    if (score <= 3) return { label: 'Beginner', color: 'bg-green-100 text-green-800' };
    if (score <= 6) return { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Advanced', color: 'bg-red-100 text-red-800' };
  };

  const difficulty = getDifficultyLabel(term.difficulty_score);

  const playPronunciation = () => {
    if (term.phonetic_en && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(term.term);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  if (compact) {
    return (
      <Link to={`/dictionary/${term.slug}`}>
        <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 group cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">
                {term.term}
              </h3>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {term.short_def}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {term.category}
              </Badge>
              
              {showUsageCount && term.usage_count && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {term.usage_count}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {term.term}
                </h3>
                {term.verification_status === 'verified' && (
                  <Badge variant="outline" className="border-green-500 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              {showPhonetics && term.phonetic_en && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-mono">
                    /{term.phonetic_en}/
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={playPronunciation}
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant="default" className="bg-primary text-white">
                {term.category}
              </Badge>
              
              {difficulty && (
                <Badge variant="outline" className={`text-xs ${difficulty.color} border-current`}>
                  {difficulty.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Definition */}
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-xl border border-primary/20 shadow-sm">
            <p className="text-foreground leading-relaxed font-medium">
              {term.short_def}
            </p>
          </div>
          
          {term.examples && term.examples.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-400 shadow-sm">
              <p className="text-xs text-blue-600 mb-2 font-semibold uppercase tracking-wide">Academic Example</p>
              <p className="text-sm italic text-blue-900 font-medium">"{term.examples[0]}"</p>
            </div>
          )}
        </div>

        {/* Tags & Disciplines */}
        {term.discipline_tags && term.discipline_tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Tags className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Related Disciplines:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {term.discipline_tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {term.discipline_tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{term.discipline_tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {showUsageCount && term.usage_count && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {term.usage_count} views
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(term.updated_at).toLocaleDateString()}
            </div>
          </div>
          
          <Link to={`/dictionary/${term.slug}`}>
            <Button variant="outline" size="sm" className="group-hover:border-primary group-hover:text-primary transition-colors">
              <BookOpen className="w-3 h-3 mr-1" />
              Explore Definition
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EncyclopediaTermCard;