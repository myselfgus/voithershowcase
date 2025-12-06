import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}
const getSpeechRecognition = (): typeof window.SpeechRecognition | null => {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
};
export function useSpeechRecognition(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.onresult = (event) => {
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
    recognition.onerror = (event) => {
      setError(event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    recognition.onend = () => {
      if (isListening) {
        // Restart listening if it was manually stopped
        recognition.start();
      }
    };
    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
    };
  }, [isListening]);
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
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Voice commands disabled.');
    }
  }, [isListening]);
  return { isListening, transcript, startListening, stopListening, error };
}