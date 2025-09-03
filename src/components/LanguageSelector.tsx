import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'buttons';
  showLabels?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'default',
  showLabels = true,
  className = ''
}) => {
  const { currentLang, setLang, supportedLanguages, isTranslating } = useLanguage();

  const currentLanguage = supportedLanguages.find(lang => lang.language_code === currentLang);

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {supportedLanguages.slice(0, 6).map((lang) => (
          <button
            key={lang.language_code}
            onClick={() => setLang(lang.language_code)}
            disabled={isTranslating}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
              ${currentLang === lang.language_code 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-background hover:bg-muted border-border'
              }
              ${isTranslating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {lang.flag_emoji && <span className="text-sm">{lang.flag_emoji}</span>}
            {showLabels && (
              <span className="text-sm font-medium">
                {lang.language_code === 'en' ? lang.language_name : lang.native_name}
              </span>
            )}
            {isTranslating && currentLang === lang.language_code && (
              <Loader2 className="w-3 h-3 animate-spin" />
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-muted-foreground" />
        <Select value={currentLang} onValueChange={setLang} disabled={isTranslating}>
          <SelectTrigger className="w-auto min-w-[120px] h-8">
            <SelectValue>
              <div className="flex items-center gap-2">
                {currentLanguage?.flag_emoji && (
                  <span className="text-sm">{currentLanguage.flag_emoji}</span>
                )}
                <span className="text-sm">
                  {currentLanguage?.language_code === 'en' 
                    ? currentLanguage?.language_name 
                    : currentLanguage?.native_name
                  }
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.language_code} value={lang.language_code}>
                <div className="flex items-center gap-2">
                  {lang.flag_emoji && <span>{lang.flag_emoji}</span>}
                  <span>{lang.language_name}</span>
                  {lang.language_code !== 'en' && (
                    <span className="text-muted-foreground">({lang.native_name})</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isTranslating && (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabels && (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Language</span>
        </div>
      )}
      <Select value={currentLang} onValueChange={setLang} disabled={isTranslating}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              {currentLanguage?.flag_emoji && (
                <span>{currentLanguage.flag_emoji}</span>
              )}
              <span>
                {currentLanguage?.language_name}
                {currentLanguage?.language_code !== 'en' && (
                  <span className="text-muted-foreground ml-1">({currentLanguage?.native_name})</span>
                )}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.language_code} value={lang.language_code}>
              <div className="flex items-center gap-3 w-full">
                {lang.flag_emoji && <span className="text-lg">{lang.flag_emoji}</span>}
                <div className="flex flex-col">
                  <span className="font-medium">{lang.language_name}</span>
                  {lang.language_code !== 'en' && (
                    <span className="text-sm text-muted-foreground">{lang.native_name}</span>
                  )}
                </div>
                {lang.language_code === currentLang && (
                  <Badge variant="secondary" className="ml-auto">Current</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isTranslating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Translating...</span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;