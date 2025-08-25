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

// Safe storage utility
const safeStorage = {
  get: (key: string) => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch {
      // Fail silently
    }
  }
};

export const useSpeechSynthesis = (
  text: string,
  slug: string
): UseSpeechSynthesisReturn => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentChunkRef = useRef(0);
  const chunksRef = useRef<string[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  // Safe feature detection
  const isSupported = typeof window !== 'undefined' && 
                     'speechSynthesis' in window && 
                     typeof SpeechSynthesisUtterance !== 'undefined';

  const [state, setState] = useState<SpeechSynthesisState>({
    isPlaying: false,
    isPaused: false,
    currentPosition: 0,
    duration: 0,
    rate: 1.0,
    selectedVoice: null,
    availableVoices: [],
    isSupported
  });

  // Client-side hydration guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved state from localStorage (client-side only)
  useEffect(() => {
    if (!isClient || !isSupported) return;

    const savedState = safeStorage.get(`${STORAGE_KEY_PREFIX}${slug}`);
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
  }, [slug, isClient, isSupported]);

  // Load available voices (client-side only)
  useEffect(() => {
    if (!isClient || !isSupported) return;

    const loadVoices = () => {
      try {
        const voices = speechSynthesis.getVoices();
        setState(prev => ({ ...prev, availableVoices: voices }));
      } catch (error) {
        console.warn('Failed to load voices:', error);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      try {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      } catch {
        // Cleanup failed, ignore
      }
    };
  }, [isClient, isSupported]);

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

  // Save state to localStorage (client-side only)
  const saveState = useCallback(() => {
    if (!isClient || !isSupported) return;

    const stateToSave = {
      positionMs: state.currentPosition,
      rate: state.rate,
      voiceURI: state.selectedVoice
    };
    safeStorage.set(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(stateToSave));
  }, [slug, state.currentPosition, state.rate, state.selectedVoice, isClient, isSupported]);

  const stop = useCallback(() => {
    if (!isClient || !isSupported) return;

    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.warn('Failed to cancel speech:', error);
    }
    
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
  }, [isClient, isSupported]);

  const play = useCallback((fromPosition?: number) => {
    if (!isClient || !isSupported || chunksRef.current.length === 0) return;

    // Stop any ongoing speech
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.warn('Failed to cancel existing speech:', error);
    }

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
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to start speech:', error);
        stop();
      }
    };

    playChunk(startChunk);
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, [isClient, isSupported, state.currentPosition, state.rate, state.selectedVoice, state.availableVoices, state.duration, stop]);

  const pause = useCallback(() => {
    if (!isClient || !isSupported) return;

    try {
      speechSynthesis.pause();
    } catch (error) {
      console.warn('Failed to pause speech:', error);
    }
    
    if (startTimeRef.current) {
      pausedAtRef.current += Date.now() - startTimeRef.current;
    }
    
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    saveState();
  }, [isClient, isSupported, saveState]);

  const resume = useCallback(() => {
    if (!isClient || !isSupported) return;

    if (state.isPaused) {
      try {
        speechSynthesis.resume();
        startTimeRef.current = Date.now();
        setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      } catch (error) {
        console.warn('Failed to resume speech:', error);
        play();
      }
    } else {
      play();
    }
  }, [isClient, isSupported, state.isPaused, play]);

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