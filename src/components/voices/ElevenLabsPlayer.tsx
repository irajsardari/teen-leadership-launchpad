import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { extractTextFromHtml } from "@/utils/extractTextFromHtml";

interface ElevenLabsPlayerProps {
  content: string;
  slug: string;
  className?: string;
}

const ElevenLabsPlayer = ({ content, slug, className = "" }: ElevenLabsPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Clean and prepare text for TTS
  const plainText = extractTextFromHtml(content);
  
  // Split text into chunks for better processing (ElevenLabs has character limits)
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

  const generateAudio = async () => {
    try {
      setIsLoading(true);
      
      // For now, use the first chunk (you could later implement full article processing)
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

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      console.log('Received audio data type:', typeof data.audioContent);
      console.log('Audio data length:', data.audioContent?.length);

      // Validate base64 string before decoding
      let audioBlob: Blob;
      try {
        // Check if it's a valid base64 string
        if (typeof data.audioContent !== 'string' || !data.audioContent) {
          throw new Error('No valid audio content received from server');
        }

        // Remove any whitespace and validate base64 format
        const base64Data = data.audioContent.replace(/\s/g, '');
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
          throw new Error('Received data is not in valid base64 format');
        }

        console.log('Decoding base64 audio data...');
        
        // Convert base64 to binary data
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        console.log('Created audio blob, size:', audioBlob.size);
        
      } catch (decodeError) {
        console.error('Base64 decode error:', decodeError);
        console.error('First 100 chars of received data:', data.audioContent?.substring(0, 100));
        throw new Error(`Failed to decode audio data: ${decodeError.message}`);
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.load();
      }

      toast({
        title: "Audio Ready",
        description: "The article audio has been generated successfully.",
      });

    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Audio Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className={`bg-gradient-to-br from-tma-primary/5 to-tma-secondary/5 border border-tma-primary/20 rounded-xl p-6 space-y-5 ${className}`}>
      <audio ref={audioRef} preload="none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlayback}
            disabled={isLoading}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-tma-primary to-tma-secondary hover:from-tma-primary/90 hover:to-tma-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            size="sm"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-tma-text-primary">
              {isLoading ? 'Generating Audio...' : isPlaying ? 'Now Playing' : 'Ready to Listen'}
            </span>
            <span className="text-xs text-tma-text-secondary">
              Article Audio
            </span>
          </div>
          
          <Button
            onClick={resetAudio}
            variant="ghost"
            size="sm"
            disabled={!audioRef.current?.src}
            className="ml-2 text-tma-text-secondary hover:text-tma-primary hover:bg-tma-primary/10 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm font-medium text-tma-text-primary bg-tma-background-subtle px-3 py-1 rounded-lg">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {duration > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-tma-text-secondary">
              <span>Progress</span>
              <span>{Math.round((currentTime / duration) * 100)}%</span>
            </div>
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={1}
              className="w-full [&_.slider-track]:bg-tma-primary/20 [&_.slider-range]:bg-gradient-to-r [&_.slider-range]:from-tma-primary [&_.slider-range]:to-tma-secondary [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-tma-primary [&_.slider-thumb]:shadow-lg"
            />
          </div>
          
          <div className="flex items-center gap-3 pt-2 border-t border-tma-primary/10">
            <Volume2 className="w-4 h-4 text-tma-text-secondary" />
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24 [&_.slider-track]:bg-tma-primary/20 [&_.slider-range]:bg-tma-primary [&_.slider-thumb]:bg-white [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-tma-primary"
            />
            <span className="text-xs text-tma-text-secondary min-w-[2rem]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevenLabsPlayer;