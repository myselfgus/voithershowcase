import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopMenuBar } from './TopMenuBar';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';
interface VoitherAppLayoutProps {
  children: React.ReactNode;
}
export function VoitherAppLayout({ children }: VoitherAppLayoutProps) {
  const location = useLocation();
  const { transcript, startListening, isSupported } = useSpeechRecognition();
  useEffect(() => {
    if (isSupported) {
      startListening();
    } else {
      toast.warning("Reconhecimento de voz não suportado neste navegador.");
    }
  }, [isSupported, startListening]);
  useEffect(() => {
    if (transcript) {
      toast.info(`Comando de voz detectado: "${transcript}"`);
      // Here you would integrate with a command parser, e.g., call /api/voice-command
    }
  }, [transcript]);
  return (
    <div className="h-screen w-screen bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain flex flex-col overflow-hidden">
      <TopMenuBar />
      <div className="flex-1 relative pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}