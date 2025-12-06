import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
interface WindowContainerProps {
  children: React.ReactNode;
  title: string;
}
export function WindowContainer({ children, title }: WindowContainerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 md:inset-8 bg-healthos-porcelain/90 dark:bg-healthos-ink/90 backdrop-blur-2xl rounded-none md:rounded-2xl shadow-2xl border border-healthos-ice/50 dark:border-healthos-ice/10 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <header className="flex items-center justify-between px-3 h-9 border-b border-healthos-ice/50 dark:border-healthos-ice/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <button className="w-3 h-3 rounded-full bg-red-500"></button>
                <button className="w-3 h-3 rounded-full bg-yellow-500"></button>
                <button className="w-3 h-3 rounded-full bg-green-500"></button>
              </div>
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <div className="w-16"></div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
              {children}
            </div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}