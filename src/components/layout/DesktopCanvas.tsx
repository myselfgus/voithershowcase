import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CanvasArtifact {
  id: string;
  type: 'text' | 'shape' | 'image' | 'chart' | 'code' | 'html';
  content: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  style?: React.CSSProperties;
  metadata?: Record<string, any>;
}

interface DesktopCanvasProps {
  artifacts?: CanvasArtifact[];
  onArtifactClick?: (artifact: CanvasArtifact) => void;
  onCanvasClick?: (position: { x: number; y: number }) => void;
  className?: string;
}

export function DesktopCanvas({
  artifacts = [],
  onArtifactClick,
  onCanvasClick,
  className
}: DesktopCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gridVisible, setGridVisible] = useState(false);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && onCanvasClick) {
      const rect = canvasRef.current.getBoundingClientRect();
      onCanvasClick({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [onCanvasClick]);

  const renderArtifact = (artifact: CanvasArtifact) => {
    switch (artifact.type) {
      case 'text':
        return (
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: artifact.content }}
          />
        );

      case 'code':
        return (
          <pre className="bg-black/80 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono">
            <code>{artifact.content}</code>
          </pre>
        );

      case 'html':
        return (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: artifact.content }}
          />
        );

      case 'chart':
        return (
          <div className="flex items-center justify-center w-full h-full bg-white/5 rounded-lg">
            <span className="text-muted-foreground">Chart: {artifact.content}</span>
          </div>
        );

      case 'shape':
        return (
          <div
            className="w-full h-full rounded-lg"
            style={{
              backgroundColor: artifact.metadata?.color || 'rgba(139, 92, 246, 0.3)',
              ...artifact.style
            }}
          />
        );

      case 'image':
        return (
          <img
            src={artifact.content}
            alt={artifact.metadata?.alt || 'AI Generated'}
            className="w-full h-full object-cover rounded-lg"
          />
        );

      default:
        return (
          <div className="text-muted-foreground">
            Unknown artifact type: {artifact.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      className={cn(
        "absolute inset-0 overflow-hidden",
        "bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100",
        "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
        gridVisible && "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjgsIDEyOCwgMTI4LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]",
        className
      )}
    >
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
      </div>

      {/* Floating ambient shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-fuchsia-500/5 dark:bg-fuchsia-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ bottom: '20%', right: '15%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ top: '50%', left: '60%' }}
        />
      </div>

      {/* Watermark / Branding */}
      <div className="absolute bottom-4 right-4 text-healthos-ink/10 dark:text-healthos-porcelain/10 pointer-events-none">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor">
          <text x="0" y="30" fontSize="14" fontWeight="600" fontFamily="system-ui">
            Voither HealthOS
          </text>
        </svg>
      </div>

      {/* AI Canvas indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-healthos-ink/30 dark:text-healthos-porcelain/30 pointer-events-none">
        <motion.div
          className="w-2 h-2 rounded-full bg-violet-500"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <span>AI Canvas Ready</span>
      </div>

      {/* Rendered artifacts */}
      <AnimatePresence>
        {artifacts.map(artifact => (
          <motion.div
            key={artifact.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={() => onArtifactClick?.(artifact)}
            className={cn(
              "absolute cursor-pointer",
              "glass-card-styles rounded-lg p-4",
              "hover:ring-2 hover:ring-violet-500/50 transition-all"
            )}
            style={{
              left: artifact.position.x,
              top: artifact.position.y,
              width: artifact.size?.width || 'auto',
              height: artifact.size?.height || 'auto',
              ...artifact.style
            }}
          >
            {renderArtifact(artifact)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing canvas artifacts
export function useCanvasArtifacts() {
  const [artifacts, setArtifacts] = useState<CanvasArtifact[]>([]);

  const addArtifact = useCallback((artifact: Omit<CanvasArtifact, 'id'>) => {
    const newArtifact: CanvasArtifact = {
      ...artifact,
      id: crypto.randomUUID()
    };
    setArtifacts(prev => [...prev, newArtifact]);
    return newArtifact.id;
  }, []);

  const removeArtifact = useCallback((id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
  }, []);

  const updateArtifact = useCallback((id: string, updates: Partial<CanvasArtifact>) => {
    setArtifacts(prev => prev.map(a =>
      a.id === id ? { ...a, ...updates } : a
    ));
  }, []);

  const clearArtifacts = useCallback(() => {
    setArtifacts([]);
  }, []);

  return {
    artifacts,
    addArtifact,
    removeArtifact,
    updateArtifact,
    clearArtifacts
  };
}
