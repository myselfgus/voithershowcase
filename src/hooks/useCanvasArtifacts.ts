import { useState, useCallback } from 'react';
import type { CanvasArtifact } from '@/components/layout/DesktopCanvas';

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
