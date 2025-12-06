import React, { useRef, useEffect } from 'react';
import styles from '@/styles/homepage.module.css';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
export function CapsuleGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      grid.style.setProperty('--glow-x', `${x}px`);
      grid.style.setProperty('--glow-y', `${y}px`);
      grid.style.setProperty('--glow-opacity', '1');
    };
    const handleMouseLeave = () => {
      grid.style.setProperty('--glow-opacity', '0');
    };
    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);
  return (
    <div ref={gridRef} className={styles.capsuleGrid}>
      {Array.from({ length: 48 }).map((_, i) => (
        <div key={i} className={styles.capsule} />
      ))}
    </div>
  );
}