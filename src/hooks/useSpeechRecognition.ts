import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
// Define a type for the SpeechRecognition API to handle vendor prefixes
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  isSupported: boolean;
}
const getSpeechRecognition = (): { new (): SpeechRecognition } | null => {
  if (typeof window !== 'undefined') {
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  }
  return null;
};
export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser.');
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };
    recognition.onerror = (event: any) => {
      setError(event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    recognition.onend = () => {
      // Only restart if we are still in a listening state.
      // This prevents restarting when stopListening is called.
      if (recognitionRef.current && isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
    recognitionRef.current = recognition;
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]); // Re-create listeners if isListening state changes externally
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
        toast.info('Voice commands enabled.');
      } catch (e) {
        console.error("Could not start recognition:", e);
        setError("Could not start recognition. It might already be running.");
      }
    }
  }, [isListening]);
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      // Set isListening to false before stopping to prevent onend from restarting
      setIsListening(false);
      recognitionRef.current.stop();
      toast.info('Voice commands disabled.');
    }
  }, [isListening]);
  return { isListening, transcript, startListening, stopListening, error, isSupported };
}