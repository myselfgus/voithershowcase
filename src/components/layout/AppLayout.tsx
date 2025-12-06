import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { TopMenuBar } from './TopMenuBar';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

export function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();
  const { transcript, startListening, isSupported } = useSpeechRecognition();

  useEffect(() => {
    if (isSupported) {
      startListening();
    }
  }, [isSupported, startListening]);

  useEffect(() => {
    if (transcript) {
      toast.info(`Comando: "${transcript}"`);
      if (transcript.toLowerCase().includes('medscribe')) {
        window.location.href = '/dashboard/apps/medscribe';
      }
    }
  }, [transcript]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-screen w-screen bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain flex flex-col overflow-hidden">
        <TopMenuBar />
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
