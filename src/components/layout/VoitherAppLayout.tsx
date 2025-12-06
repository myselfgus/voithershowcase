import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopMenuBar } from './TopMenuBar';
interface VoitherAppLayoutProps {
  children: React.ReactNode;
}
export function VoitherAppLayout({ children }: VoitherAppLayoutProps) {
  const location = useLocation();
  return (
    <div className="h-screen w-screen bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain flex flex-col overflow-hidden">
      <TopMenuBar />
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}