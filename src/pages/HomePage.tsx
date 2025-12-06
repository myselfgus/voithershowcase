import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-healthos-porcelain text-healthos-ink">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-4 bg-gradient-prism rounded-2xl mb-6">
            <div className="h-12 w-12 bg-white rounded-lg" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display">HealthOS Cast</h1>
          <p className="mt-4 text-lg text-muted-foreground">O sistema operacional cognitivo para saúde.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/dashboard">Entrar no HealthOS</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}