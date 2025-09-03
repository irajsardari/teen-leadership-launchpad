import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromHtml } from "@/utils/extractTextFromHtml";

interface ModernElevenLabsPlayerProps {
  content: string;
  slug: string;
  className?: string;
}

type LoadingState = 'idle' | 'queued' | 'preparing' | 'finalizing' | 'ready' | 'error';

const ModernElevenLabsPlayer = ({ content, slug, className = "" }: ModernElevenLabsPlayerProps) => {
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
      case 'queued': return 'Queued for processing...';
      case 'preparing': return 'Generating studio-quality voice...';
      case 'finalizing': return 'Finalizing audio...';
      case 'ready': return isPlaying ? 'Now Playing' : 'Ready to Listen';
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
        title: "Audio Generation Failed",
        description: "Please try again in a moment.",
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
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={playerRef} 
      className={`
        relative overflow-hidden group
        bg-gradient-to-br from-white/95 via-white to-muted/30
        border border-border/50 rounded-3xl 
        shadow-lg hover:shadow-xl transition-all duration-500 ease-out
        hover:border-primary/30 hover:shadow-primary/10
        backdrop-blur-sm
        ${className}
      `}
      aria-live="polite"
      tabIndex={0}
      role="region"
      aria-label="Audio player for article"
    >
      <audio ref={audioRef} preload="none" />
      
      {/* Modern Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <Volume2 className="w-5 h-5 text-primary-foreground" />
              </div>
              {isCached && isReady && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Studio Quality Voice</h3>
              <p className="text-sm text-muted-foreground">AI-powered audio experience</p>
            </div>
          </div>
          
          {duration > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-muted-foreground tabular-nums">
                / {formatTime(duration)}
              </div>
            </div>
          )}
        </div>
        
        {/* Status Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold text-foreground">
              {getStateMessage()}
            </div>
            {isCached && isReady && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Cached
              </div>
            )}
          </div>
          {loadingState === 'error' && (
            <p className="text-sm text-destructive">Tap the play button to retry generation</p>
          )}
        </div>
        
        {/* Central Play Button */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={loadingState === 'error' ? retryGeneration : togglePlayback}
            disabled={isLoading}
            className={`
              relative inline-flex items-center justify-center
              w-24 h-24 rounded-full transition-all duration-300 ease-out
              ${isLoading 
                ? 'bg-muted cursor-not-allowed opacity-50' 
                : `bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70
                   shadow-xl hover:shadow-2xl hover:shadow-primary/25 hover:scale-105 active:scale-95
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`
              }
              before:content-[''] before:absolute before:inset-0 before:rounded-full 
              before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none
            `}
            aria-label={loadingState === 'error' ? 'Retry audio generation' : (isPlaying ? 'Pause audio' : 'Play audio')}
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            ) : loadingState === 'error' ? (
              <AlertCircle className="w-8 h-8 text-destructive" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Play className="w-8 h-8 ml-0.5 text-primary-foreground" />
            )}
          </button>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="mb-8" aria-live="polite">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <p className="text-base font-semibold text-foreground">
                Preparing studio-quality audio (~30–45s)
              </p>
              <p className="text-sm text-muted-foreground">
                {loadingState === 'queued' && "Queued for processing..."}
                {loadingState === 'preparing' && "Generating high-quality voice. This takes a moment first time."}
                {loadingState === 'finalizing' && "Almost ready..."}
              </p>
              {showTimeout && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-800 font-medium">
                    ⏱️ Still working—quality audio takes 30–45 seconds to generate
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Future plays will be instant once cached
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Progress Bar - only show when audio is loaded */}
        {duration > 0 && !isLoading && (
          <div className="space-y-3 mb-6">
            <div className="relative">
              <Slider
                value={[progressPercentage]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full cursor-pointer"
                aria-label="Audio progress"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{Math.round(progressPercentage)}%</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Button
              onClick={resetAudio}
              variant="ghost"
              size="sm"
              disabled={!audioRef.current?.src || isLoading}
              className="h-9 w-9 p-0 hover:bg-muted"
              aria-label="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="w-24">
              <Slider
                value={[volume * 100]}
                max={100}
                step={5}
                onValueChange={handleVolumeChange}
                className="w-full"
                aria-label="Volume control"
              />
            </div>
            <span className="text-sm text-muted-foreground min-w-[2.5rem] text-right tabular-nums">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernElevenLabsPlayer;