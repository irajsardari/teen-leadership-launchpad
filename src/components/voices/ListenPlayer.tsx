import React from 'react';
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
  { value: 1.0, label: '1.0× Normal' },
  { value: 1.25, label: '1.25×' },
  { value: 1.5, label: '1.5× Faster' },
  { value: 2.0, label: '2.0× Speed' }
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

// Error Boundary Component
class TTSErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('TTS Player crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Hide player if it crashes
    }
    return this.props.children;
  }
}

export const ListenPlayer = ({ content, slug, className = '' }: ListenPlayerProps) => {
  console.log('ListenPlayer render:', { content: content?.substring(0, 100), slug, className });
  
  const [plainText, setPlainText] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar' | 'fa'>('en');
  const [isClient, setIsClient] = useState(false);
  
  // Client-side hydration guard
  useEffect(() => {
    console.log('ListenPlayer: Setting isClient to true');
    setIsClient(true);
  }, []);

  const speech = useSpeechSynthesis(plainText, slug);

  // Extract text and detect language (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const text = extractTextFromHtml(content || '');
      setPlainText(text);
      setLanguage(detectLanguage(text));
    } catch (error) {
      console.warn('Failed to extract text from HTML:', error);
      setPlainText('');
    }
  }, [content, isClient]);

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

  // Handle keyboard shortcuts (scoped to avoid interfering with navigation)
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if the player is focused or no input is focused
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' ||
                            activeElement?.contentEditable === 'true';
      
      if (isInputFocused) return;

      // Only handle if we're in the article area (avoid interfering with navigation)
      const playerElement = document.querySelector('[data-tts-player]');
      if (!playerElement) return;

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
  }, [handlePlayPause, speech, isClient]);

  // Don't render during SSR
  if (!isClient) {
    console.log('ListenPlayer: Not client-side yet, showing loading');
    return (
      <div className={`text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg ${className}`}>
        Loading listen feature...
      </div>
    );
  }

  // Show unsupported message if TTS not available
  if (!speech.isSupported) {
    console.log('ListenPlayer: TTS not supported');
    return (
      <div className={`text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg ${className}`}>
        {t.unsupported}
      </div>
    );
  }

  // Check if content is ready
  const hasContent = plainText && plainText.trim();
  const isDisabled = !hasContent;
  
  console.log('ListenPlayer: Render state', { 
    isClient, 
    isSupported: speech.isSupported, 
    hasContent, 
    isDisabled, 
    plainTextLength: plainText?.length 
  });

  const progressPercentage = speech.duration > 0 
    ? (speech.currentPosition / speech.duration) * 100 
    : 0;

  const showResumeText = speech.currentPosition > 5000 && !speech.isPlaying && !speech.isPaused;

  return (
    <TTSErrorBoundary>
      <div 
        className={`bg-gradient-to-br from-tma-blue/5 via-tma-cream to-tma-teal/5 border-2 border-tma-orange/30 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-sm ${className}`}
        data-tts-player
      >
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-xl flex items-center justify-center shadow-lg">
            <Volume2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-tma-blue">Studio Quality Voice</h3>
            <p className="text-sm text-tma-text/70">Listen to this article</p>
          </div>
        </div>
        {speech.duration > 0 && (
          <div className="text-right">
            <div className="text-2xl font-black text-tma-blue">{formatTime(speech.currentPosition)} / {formatTime(speech.duration)}</div>
          </div>
        )}
      </div>

      {/* Main Play Button */}
      <div className="flex items-center justify-center">
        <Button
          onClick={handlePlayPause}
          variant="default"
          size="lg"
          className="flex items-center gap-4 bg-gradient-to-r from-tma-orange to-tma-yellow hover:from-tma-yellow hover:to-tma-orange text-white font-black px-12 py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white/30"
          aria-label={speech.isPlaying ? t.pause : speech.isPaused ? t.resume : t.listen}
          disabled={isDisabled}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full">
            {speech.isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </div>
          <span className="text-xl tracking-wide">
            {speech.isPlaying ? t.pause : speech.isPaused ? 'Ready to Listen' : t.listen}
          </span>
        </Button>
      </div>

      {/* Status Messages */}
      {showResumeText && !isDisabled && (
        <div className="text-center">
          <span className="text-sm text-tma-blue font-medium bg-tma-blue/10 px-4 py-2 rounded-full">
            {t.resumeWhere}
          </span>
        </div>
      )}

      {isDisabled && (
        <div className="text-center">
          <span className="text-sm text-tma-text/70 bg-tma-cream px-4 py-2 rounded-full">
            Preparing studio-quality audio (~30-45s)
          </span>
          <p className="text-xs text-tma-text/50 mt-2">Generating high-quality voice. This takes a moment first time.</p>
        </div>
      )}

      {/* Premium Progress Bar */}
      {speech.duration > 0 && (
        <div className="space-y-3">
          <Slider
            value={[speech.currentPosition]}
            max={speech.duration}
            step={1000}
            onValueChange={handleProgressChange}
            className="w-full [&_[data-orientation=horizontal]]:h-3 [&_[role=slider]]:w-6 [&_[role=slider]]:h-6 [&_[role=slider]]:bg-tma-blue [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-lg"
            aria-label="Audio progress"
          />
          <div className="flex justify-between text-sm font-medium text-tma-blue">
            <span>{formatTime(speech.currentPosition)}</span>
            <span>{formatTime(speech.duration)}</span>
          </div>
        </div>
      )}

      {/* Premium Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-tma-blue/20">
        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-tma-blue">{t.speed}</span>
          <Select value={speech.rate.toString()} onValueChange={handleSpeedChange}>
            <SelectTrigger className="w-24 h-10 text-sm border-tma-blue/30 rounded-xl">
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
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-tma-blue">{t.voice}</span>
            <Select 
              value={speech.selectedVoice || ''} 
              onValueChange={handleVoiceChange}
            >
              <SelectTrigger className="w-40 h-10 text-sm border-tma-blue/30 rounded-xl">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default</SelectItem>
                {speech.availableVoices
                  .filter(voice => voice.lang.startsWith(language) || voice.lang.startsWith('en'))
                  .slice(0, 5)
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
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0 border-tma-blue/30 rounded-xl hover:bg-tma-blue/10"
          title="Reset to beginning"
          aria-label="Reset to beginning"
        >
          <RotateCcw className="h-4 w-4 text-tma-blue" />
        </Button>
      </div>
      </div>
    </TTSErrorBoundary>
  );
};