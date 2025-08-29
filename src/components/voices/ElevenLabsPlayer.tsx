import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromHtml } from "@/utils/extractTextFromHtml";

interface ElevenLabsPlayerProps {
  content: string;
  slug: string;
  className?: string;
}

type LoadingState = 'idle' | 'queued' | 'preparing' | 'finalizing' | 'ready' | 'error';

const ElevenLabsPlayer = ({ content, slug, className = "" }: ElevenLabsPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isCached, setIsCached] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Clean and prepare text for TTS
  const plainText = extractTextFromHtml(content);
  
  // Generate content hash for cache key
  const generateContentHash = useCallback((text: string): string => {
    let hash = 0;
    const normalizedText = text.replace(/\s+/g, ' ').trim().toLowerCase();
    for (let i = 0; i < normalizedText.length; i++) {
      const char = normalizedText.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }, []);

  const cacheKey = `voices-audio/${slug}.en.${generateContentHash(plainText)}.mp3`;
  
  // Split text into chunks for better processing
  const chunkText = (text: string, maxLength: number = 2500): string[] => {
    if (text.length <= maxLength) return [text];
    
    const sentences = text.split(/[.!?]+/);
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          chunks.push(sentence.trim());
        }
      } else {
        currentChunk += sentence + '.';
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  };

  // Check if audio is cached
  const checkCache = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('audio-cache')
        .download(cacheKey);
      
      if (error || !data) return null;
      
      const audioUrl = URL.createObjectURL(data);
      setIsCached(true);
      return audioUrl;
    } catch (error) {
      console.log('Cache miss for:', cacheKey);
      return null;
    }
  }, [cacheKey]);

  // Save audio to cache
  const saveToCache = useCallback(async (audioBlob: Blob): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('audio-cache')
        .upload(cacheKey, audioBlob, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (!error) {
        setIsCached(true);
        console.log('Audio cached successfully:', cacheKey);
      }
    } catch (error) {
      console.log('Failed to cache audio:', error);
    }
  }, [cacheKey]);

  // Get state message
  const getStateMessage = () => {
    switch (loadingState) {
      case 'queued': return 'Queued';
      case 'preparing': return 'Preparing studio-quality voice...';
      case 'finalizing': return 'Finalizing...';
      case 'ready': return isPlaying ? 'Now Playing' : (isCached ? 'Ready to Listen (Cached)' : 'Ready to Listen');
      case 'error': return 'Generation failed';
      default: return isCached ? 'Ready to Listen (Cached)' : 'Ready to Listen';
    }
  };

  const generateAudio = async () => {
    try {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setLoadingState('queued');
      setShowTimeout(false);
      
      // Brief queued state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check cache first
      const cachedUrl = await checkCache();
      if (cachedUrl) {
        if (audioRef.current) {
          audioRef.current.src = cachedUrl;
          await audioRef.current.load();
        }
        
        setLoadingState('ready');
        toast({
          title: "Audio Ready",
          description: "Audio ready. Future plays will start instantly.",
        });
        return;
      }

      // Set timeout warning
      timeoutRef.current = setTimeout(() => {
        setShowTimeout(true);
      }, 25000);

      setLoadingState('preparing');
      
      const chunks = chunkText(plainText);
      const textToSpeak = chunks[0] || plainText.substring(0, 2500);
      
      console.log('Generating audio for text:', textToSpeak.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { 
          text: textToSpeak,
          voice_id: '9BWtsMINqrJLrRacOk9x' // Aria voice
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate audio');
      }

      setLoadingState('finalizing');

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Validate and decode base64
      let audioBlob: Blob;
      try {
        if (typeof data.audioContent !== 'string' || !data.audioContent) {
          throw new Error('No valid audio content received from server');
        }

        const base64Data = data.audioContent.replace(/\s/g, '');
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
          throw new Error('Received data is not in valid base64 format');
        }

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        
      } catch (decodeError) {
        console.error('Base64 decode error:', decodeError);
        throw new Error(`Failed to decode audio data: ${decodeError.message}`);
      }
      
      // Save to cache for next time
      await saveToCache(audioBlob);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.load();
      }

      setLoadingState('ready');
      setShowTimeout(false);
      
      toast({
        title: "Audio Ready",
        description: "Audio ready. Future plays will start instantly.",
      });

    } catch (error) {
      console.error('Error generating audio:', error);
      setLoadingState('error');
      setShowTimeout(false);
      
      toast({
        title: "We couldn't generate the audio",
        description: "Try again.",
        variant: "destructive",
      });
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current?.src) {
      await generateAudio();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        toast({
          title: "Playback Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Prefetch audio when player enters viewport
  const prefetchAudio = useCallback(async () => {
    if (!audioRef.current?.src && loadingState === 'idle') {
      console.log('Prefetching audio...');
      const cachedUrl = await checkCache();
      if (cachedUrl && audioRef.current) {
        audioRef.current.src = cachedUrl;
        await audioRef.current.load();
        setLoadingState('ready');
      }
    }
  }, [checkCache, loadingState]);

  // Intersection Observer for prefetching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchAudio();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (playerRef.current) {
      observer.observe(playerRef.current);
    }

    return () => observer.disconnect();
  }, [prefetchAudio]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target === playerRef.current || playerRef.current?.contains(e.target as Node)) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          togglePlayback();
        } else if (e.code === 'Escape' && isPlaying) {
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const retryGeneration = () => {
    setLoadingState('idle');
    generateAudio();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const isLoading = ['queued', 'preparing', 'finalizing'].includes(loadingState);
  const isReady = loadingState === 'ready' || (!isLoading && audioRef.current?.src);

  return (
    <div 
      ref={playerRef} 
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-white via-tma-light-grey/30 to-tma-bright-orange/5
        border-2 border-tma-deep-blue/20 rounded-2xl p-8 space-y-6 
        shadow-xl hover:shadow-2xl transition-all duration-500
        before:content-[''] before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-tma-bright-orange/5 before:to-tma-deep-blue/5 before:pointer-events-none
        after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-1
        after:bg-gradient-to-r after:from-tma-bright-orange after:via-tma-deep-blue after:to-tma-bright-orange
        ${className}
      `}
      aria-live="polite"
      tabIndex={0}
      role="region"
      aria-label="Audio player for article"
    >
      <audio ref={audioRef} preload="none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Enhanced TMA 3D Button with Prominent Design */}
            <button
              onClick={loadingState === 'error' ? retryGeneration : togglePlayback}
              disabled={isLoading}
              className={`
                tma-play-button
                inline-flex items-center justify-center
                w-16 h-16 rounded-full
                bg-gradient-to-b from-tma-bright-orange to-tma-deep-blue
                text-white cursor-pointer relative
                shadow-xl hover:shadow-2xl
                transition-all duration-300 ease-out
                ${isLoading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:translate-y-0 active:scale-100'}
                ${isCached && isReady ? 'ring-4 ring-tma-bright-orange/80 ring-offset-2' : 'ring-2 ring-white/20'}
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tma-bright-orange focus-visible:ring-offset-3
                before:content-[''] before:absolute before:inset-0 before:rounded-full 
                before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none
                after:content-[''] after:absolute after:inset-0 after:rounded-full
                after:shadow-inner after:pointer-events-none
              `}
              aria-label={loadingState === 'error' ? 'Retry audio generation' : (isPlaying ? 'Pause audio' : 'Play audio')}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : loadingState === 'error' ? (
                <AlertCircle className="w-7 h-7 drop-shadow-lg" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 drop-shadow-lg" />
              ) : (
                <Play className="w-7 h-7 ml-0.5 drop-shadow-lg" />
              )}
            </button>
            
            {isCached && isReady && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-tma-emerald-green rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-tma-deep-blue">
              {getStateMessage()}
            </span>
            <span className="text-xs text-tma-charcoal-grey/70">
              {loadingState === 'error' ? 'Click to retry' : 'Studio Quality Voice'}
            </span>
          </div>
          
          <Button
            onClick={resetAudio}
            variant="ghost"
            size="sm"
            disabled={!audioRef.current?.src || isLoading}
            className="ml-2 text-tma-charcoal-grey/60 hover:text-tma-deep-blue hover:bg-tma-deep-blue/10 rounded-lg transition-colors"
            aria-label="Reset audio to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm font-medium text-tma-deep-blue bg-tma-light-grey px-3 py-1.5 rounded-lg border border-tma-deep-blue/10">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Enhanced Loading States for Better UX */}
      {isLoading && (
        <div className="space-y-4" aria-live="polite">
          <div className="w-full bg-tma-deep-blue/10 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-tma-bright-orange to-tma-deep-blue animate-pulse relative">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-slide-progress"
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-tma-bright-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-tma-bright-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-tma-bright-orange rounded-full animate-bounce"></div>
            </div>
            <p className="text-base font-semibold text-tma-deep-blue">
              Preparing studio-quality audio (~30–45s)
            </p>
            <p className="text-sm text-tma-charcoal-grey/80">
              {loadingState === 'queued' && "Queued for processing..."}
              {loadingState === 'preparing' && "Generating high-quality voice. This takes a moment first time."}
              {loadingState === 'finalizing' && "Almost ready..."}
            </p>
            {showTimeout && (
              <div className="bg-tma-bright-orange/10 border border-tma-bright-orange/30 rounded-lg p-3 mt-3">
                <p className="text-sm text-tma-bright-orange font-medium">
                  ⏱️ Still working—quality audio takes 30–45 seconds to generate
                </p>
                <p className="text-xs text-tma-charcoal-grey/80 mt-1">
                  Future plays will be instant once cached
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ready State Indicator */}
      {isReady && !isLoading && (
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-tma-emerald-green">
            <div className="w-2 h-2 bg-tma-emerald-green rounded-full animate-pulse"></div>
            {isCached ? "Audio ready (cached)" : "Audio ready"}
          </div>
        </div>
      )}

      {/* Progress Controls */}
      {duration > 0 && isReady && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-tma-charcoal-grey/70">
              <span>Progress</span>
              <span>{Math.round((currentTime / duration) * 100)}%</span>
            </div>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={1}
              className="w-full [&_.slider-track]:bg-tma-deep-blue/20 [&_.slider-range]:bg-tma-bright-orange [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-tma-deep-blue [&_.slider-thumb]:shadow-lg hover:[&_.slider-thumb]:scale-110 [&_.slider-thumb]:transition-transform"
            />
          </div>
          
          <div className="flex items-center gap-3 pt-2 border-t border-tma-deep-blue/10">
            <Volume2 className="w-4 h-4 text-tma-charcoal-grey/70" />
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24 [&_.slider-track]:bg-tma-deep-blue/20 [&_.slider-range]:bg-tma-deep-blue [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-tma-deep-blue hover:[&_.slider-thumb]:scale-110 [&_.slider-thumb]:transition-transform"
            />
            <span className="text-xs text-tma-charcoal-grey/70 min-w-[2rem] font-medium">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevenLabsPlayer;