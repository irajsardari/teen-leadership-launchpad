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
    <div className={`bg-accent/50 rounded-lg p-4 space-y-4 ${className}`}>
      <audio ref={audioRef} preload="none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlayback}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isLoading ? 'Generating...' : isPlaying ? 'Pause' : 'Listen'}
          </Button>
          
          <Button
            onClick={resetAudio}
            variant="ghost"
            size="sm"
            disabled={!audioRef.current?.src}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {duration > 0 && (
        <div className="space-y-3">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        🎧 High-quality AI voice powered by ElevenLabs
      </p>
    </div>
  );
};

export default ElevenLabsPlayer;