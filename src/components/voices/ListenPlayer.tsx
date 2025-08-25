import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { extractTextFromHtml, formatTime, detectLanguage } from '@/utils/extractTextFromHtml';
import { useEffect, useState, useCallback } from 'react';

interface ListenPlayerProps {
  content: string;
  slug: string;
  className?: string;
}

const SPEED_OPTIONS = [
  { value: 0.75, label: '0.75×' },
  { value: 1.0, label: '1.0×' },
  { value: 1.25, label: '1.25×' },
  { value: 1.5, label: '1.5×' }
];

const TRANSLATIONS = {
  en: {
    listen: 'Listen',
    pause: 'Pause',
    resume: 'Resume',
    speed: 'Speed',
    voice: 'Voice',
    unsupported: 'Audio playback not supported in this browser',
    resumeWhere: 'Resume where I left off'
  },
  ar: {
    listen: 'استمع',
    pause: 'إيقاف مؤقت',
    resume: 'استئناف',
    speed: 'السرعة',
    voice: 'الصوت',
    unsupported: 'تشغيل الصوت غير مدعوم في هذا المتصفح',
    resumeWhere: 'أكمل من حيث توقفت'
  },
  fa: {
    listen: 'گوش بده',
    pause: 'مکث',
    resume: 'ادامه',
    speed: 'سرعت',
    voice: 'صدا',
    unsupported: 'پخش صوت در این مرورگر پشتیبانی نمی‌شود',
    resumeWhere: 'ادامه از آخرین جای من'
  }
};

export const ListenPlayer = ({ content, slug, className = '' }: ListenPlayerProps) => {
  const [plainText, setPlainText] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar' | 'fa'>('en');
  
  const speech = useSpeechSynthesis(plainText, slug);

  // Extract text and detect language
  useEffect(() => {
    const text = extractTextFromHtml(content);
    setPlainText(text);
    setLanguage(detectLanguage(text));
  }, [content]);

  // Get translations for current language
  const t = TRANSLATIONS[language];

  // Handle play/pause toggle
  const handlePlayPause = useCallback(() => {
    if (speech.isPlaying) {
      speech.pause();
    } else if (speech.isPaused) {
      speech.resume();
    } else {
      speech.play();
    }
  }, [speech]);

  // Handle speed change
  const handleSpeedChange = useCallback((value: string) => {
    speech.setRate(parseFloat(value));
  }, [speech]);

  // Handle voice change
  const handleVoiceChange = useCallback((voiceURI: string) => {
    speech.setVoice(voiceURI);
  }, [speech]);

  // Handle progress bar change
  const handleProgressChange = useCallback((value: number[]) => {
    speech.seek(value[0]);
  }, [speech]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if the player is focused or no input is focused
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' ||
                            activeElement?.contentEditable === 'true';
      
      if (isInputFocused) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const newPosition = Math.max(0, speech.currentPosition - 10000);
        speech.seek(newPosition);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const newPosition = Math.min(speech.duration, speech.currentPosition + 10000);
        speech.seek(newPosition);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, speech]);

  // Don't render if speech synthesis is not supported
  if (!speech.isSupported) {
    return (
      <div className={`text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg ${className}`}>
        {t.unsupported}
      </div>
    );
  }

  // Don't render if no content
  if (!plainText.trim()) {
    return null;
  }

  const progressPercentage = speech.duration > 0 
    ? (speech.currentPosition / speech.duration) * 100 
    : 0;

  const showResumeText = speech.currentPosition > 5000 && !speech.isPlaying && !speech.isPaused;

  return (
    <div className={`bg-muted/30 border border-border/50 rounded-xl p-4 space-y-4 ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayPause}
          variant="default"
          size="sm"
          className="flex items-center gap-2 bg-tma-blue hover:bg-tma-blue/90"
          aria-label={speech.isPlaying ? t.pause : speech.isPaused ? t.resume : t.listen}
        >
          {speech.isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {speech.isPlaying ? t.pause : speech.isPaused ? t.resume : t.listen}
          </span>
        </Button>

        {showResumeText && (
          <span className="text-xs text-muted-foreground italic">
            {t.resumeWhere}
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[speech.currentPosition]}
          max={speech.duration}
          step={1000}
          onValueChange={handleProgressChange}
          className="w-full"
          aria-label="Audio progress"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(speech.currentPosition)}</span>
          <span>{formatTime(speech.duration)}</span>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/30">
        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t.speed}</span>
          <Select value={speech.rate.toString()} onValueChange={handleSpeedChange}>
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPEED_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selector - Only show if multiple voices available */}
        {speech.availableVoices.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t.voice}</span>
            <Select 
              value={speech.selectedVoice || ''} 
              onValueChange={handleVoiceChange}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                {speech.availableVoices
                  .filter(voice => voice.lang.startsWith(language) || voice.lang.startsWith('en'))
                  .slice(0, 5) // Limit to first 5 relevant voices
                  .map((voice) => (
                    <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name.length > 20 ? voice.name.substring(0, 20) + '...' : voice.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset button */}
        <Button
          onClick={() => speech.seek(0)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Reset to beginning"
          aria-label="Reset to beginning"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};