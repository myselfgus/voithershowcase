import React, { useRef, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useIsMobile } from '@/hooks/use-mobile';
interface Particle {
  x: number; y: number;
  startX: number; startY: number;
  targetX: number; targetY: number;
  size: number;
  color: string;
}
export function ParticleFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const animationFrameId = useRef<number>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 50 : 100;
  const draw = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[], progress: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    particles.forEach(p => {
      const currentX = p.startX + (p.targetX - p.startX) * easedProgress;
      const currentY = p.startY + (p.targetY - p.startY) * easedProgress;
      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: 0, y: 0,
        startX: Math.random() * rect.width * 0.3,
        startY: Math.random() * rect.height,
        targetX: rect.width * 0.6 + Math.random() * rect.width * 0.3,
        targetY: (i / particleCount) * rect.height * 0.8 + rect.height * 0.1 + (Math.floor(i/10) % 2 === 0 ? 0 : 5),
        size: Math.random() * 1.5 + 0.5,
        color: `rgba(11, 18, 32, ${Math.random() * 0.5 + 0.3})`,
      });
    }
    if (prefersReducedMotion) {
      draw(ctx, particles, 1);
      return;
    }
    let startTime: number;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      draw(ctx, particles, progress);
      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };
    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [inView, prefersReducedMotion, draw, particleCount]);
  return <canvas ref={canvasRef} className="w-full h-full" />;
}