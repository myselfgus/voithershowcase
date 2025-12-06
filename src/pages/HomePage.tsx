import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <div className="bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <main className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold font-display text-healthos-ink dark:text-healthos-porcelain">
                Voither HealthOS
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                O Sistema Operacional Cognitivo para Saúde.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link to="/dashboard">Entrar no OS</Link>
              </Button>
            </motion.div>
          </main>
          <footer className="py-8">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Voither. Todos os direitos reservados. Built with ❤️ at Cloudflare.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}