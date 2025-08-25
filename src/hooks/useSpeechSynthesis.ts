import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechSynthesisState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: number;
  duration: number;
  rate: number;
  selectedVoice: string | null;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
}

interface UseSpeechSynthesisReturn extends SpeechSynthesisState {
  play: (fromPosition?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setVoice: (voiceURI: string) => void;
  seek: (position: number) => void;
}

const CHUNK_SIZE = 4000; // Safe chunk size for utterances
const STORAGE_KEY_PREFIX = 'voices:';

export const useSpeechSynthesis = (
  text: string,
  slug: string
): UseSpeechSynthesisReturn => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentChunkRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef(0);

  const [state, setState] = useState<SpeechSynthesisState>({
    isPlaying: false,
    isPaused: false,
    currentPosition: 0,
    duration: 0,
    rate: 1.0,
    selectedVoice: null,
    availableVoices: [],
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  });

  // Load saved state from localStorage
  useEffect(() => {
    if (!state.isSupported) return;

    const savedState = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prev => ({
          ...prev,
          currentPosition: parsed.positionMs || 0,
          rate: parsed.rate || 1.0,
          selectedVoice: parsed.voiceURI || null
        }));
      } catch (error) {
        console.warn('Failed to parse saved speech state:', error);
      }
    }
  }, [slug, state.isSupported]);

  // Load available voices
  useEffect(() => {
    if (!state.isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setState(prev => ({ ...prev, availableVoices: voices }));
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [state.isSupported]);

  // Split text into chunks
  useEffect(() => {
    if (!text) return;

    const chunks = [];
    let currentChunk = '';
    const sentences = text.split(/[.!?]+/);

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > CHUNK_SIZE) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '.';
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    chunksRef.current = chunks;
    
    // Estimate duration (rough calculation: 200 words per minute)
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 200) * 60 * 1000; // in milliseconds
    setState(prev => ({ ...prev, duration: estimatedDuration }));
  }, [text]);

  // Save state to localStorage
  const saveState = useCallback(() => {
    if (!state.isSupported) return;

    const stateToSave = {
      positionMs: state.currentPosition,
      rate: state.rate,
      voiceURI: state.selectedVoice
    };
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(stateToSave));
  }, [slug, state.currentPosition, state.rate, state.selectedVoice, state.isSupported]);

  const stop = useCallback(() => {
    if (!state.isSupported) return;

    speechSynthesis.cancel();
    utteranceRef.current = null;
    currentChunkRef.current = 0;
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentPosition: 0
    }));
  }, [state.isSupported]);

  const play = useCallback((fromPosition?: number) => {
    if (!state.isSupported || chunksRef.current.length === 0) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const startPosition = fromPosition ?? state.currentPosition;
    
    // Calculate which chunk to start from based on position
    const totalText = chunksRef.current.join(' ');
    const charsPerMs = totalText.length / state.duration;
    const startChar = Math.floor(startPosition * charsPerMs);
    
    let currentChar = 0;
    let startChunk = 0;
    
    for (let i = 0; i < chunksRef.current.length; i++) {
      if (currentChar + chunksRef.current[i].length >= startChar) {
        startChunk = i;
        break;
      }
      currentChar += chunksRef.current[i].length;
    }

    currentChunkRef.current = startChunk;
    startTimeRef.current = Date.now();
    pausedAtRef.current = startPosition;

    const playChunk = (chunkIndex: number) => {
      if (chunkIndex >= chunksRef.current.length) {
        stop();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunksRef.current[chunkIndex]);
      utterance.rate = state.rate;
      
      if (state.selectedVoice) {
        const voice = state.availableVoices.find(v => v.voiceURI === state.selectedVoice);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => {
        currentChunkRef.current++;
        playChunk(currentChunkRef.current);
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        stop();
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    playChunk(startChunk);
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, [state.isSupported, state.currentPosition, state.rate, state.selectedVoice, state.availableVoices, state.duration, stop]);

  const pause = useCallback(() => {
    if (!state.isSupported) return;

    speechSynthesis.pause();
    
    if (startTimeRef.current) {
      pausedAtRef.current += Date.now() - startTimeRef.current;
    }
    
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    saveState();
  }, [state.isSupported, saveState]);

  const resume = useCallback(() => {
    if (!state.isSupported) return;

    if (state.isPaused) {
      speechSynthesis.resume();
      startTimeRef.current = Date.now();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      play();
    }
  }, [state.isSupported, state.isPaused, play]);

  const setRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, rate }));
    saveState();
  }, [saveState]);

  const setVoice = useCallback((voiceURI: string) => {
    setState(prev => ({ ...prev, selectedVoice: voiceURI }));
    saveState();
  }, [saveState]);

  const seek = useCallback((position: number) => {
    setState(prev => ({ ...prev, currentPosition: position }));
    
    if (state.isPlaying) {
      play(position);
    }
  }, [state.isPlaying, play]);

  // Update current position during playback
  useEffect(() => {
    if (!state.isPlaying || !startTimeRef.current) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current!;
      const currentPos = pausedAtRef.current + elapsed;
      
      setState(prev => ({ 
        ...prev, 
        currentPosition: Math.min(currentPos, prev.duration)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  // Save state periodically during playback
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(saveState, 5000);
    return () => clearInterval(interval);
  }, [state.isPlaying, saveState]);

  return {
    ...state,
    play,
    pause,
    resume,
    stop,
    setRate,
    setVoice,
    seek
  };
};