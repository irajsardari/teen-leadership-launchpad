import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Loader2 } from 'lucide-react';
import { Lang, supportedLanguages } from '@/utils/language';

interface LanguageSelectorProps {
  currentLang: Lang;
  onLanguageChange: (lang: Lang) => void;
  isTranslating?: boolean;
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  isTranslating = false,
  showLabel = true,
  compact = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && !compact && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>Language:</span>
        </div>
      )}
      
      <Select value={currentLang} onValueChange={onLanguageChange} disabled={isTranslating}>
        <SelectTrigger className={`${compact ? 'w-auto' : 'w-40'} h-9`}>
          <SelectValue>
            <div className="flex items-center gap-2">
              {isTranslating && <Loader2 className="w-3 h-3 animate-spin" />}
              <span className="text-lg">{supportedLanguages[currentLang].flag}</span>
              {!compact && (
                <span className="font-medium">
                  {supportedLanguages[currentLang].nativeName}
                </span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(supportedLanguages).map(([code, config]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{config.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{config.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{config.name}</span>
                </div>
                {code === 'en' && (
                  <Badge variant="outline" className="text-xs">Default</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isTranslating && !compact && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Translating...
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;