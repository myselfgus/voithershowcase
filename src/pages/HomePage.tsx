import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { User, Stethoscope, Hospital } from 'lucide-react';
import { useRoleStore } from '@/stores/useRoleStore';
const roles = [
  { role: 'patient', label: 'Paciente Soberano', desc: 'Controle total dos seus dados.', icon: User },
  { role: 'professional', label: 'Profissional de Saúde', desc: 'Acesso inteligente e documentação com IA.', icon: Stethoscope },
  { role: 'service', label: 'Unidade de Saúde', desc: 'Gestão administrativa e conformidade.', icon: Hospital }
];
export function HomePage() {
  const navigate = useNavigate();
  const setRole = useRoleStore((state) => state.setRole);
  const handleRoleSelect = (role: 'patient' | 'professional' | 'service') => {
    setRole(role);
    navigate('/dashboard');
  };
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-healthos-porcelain text-healthos-ink dark:bg-healthos-ink dark:text-healthos-porcelain p-4">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-3 bg-gradient-prism rounded-2xl mb-6 shadow-lg">
            <div className="h-12 w-12 bg-white/80 dark:bg-black/80 rounded-lg flex items-center justify-center font-bold text-2xl text-gradient-prism">
              V
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight">Voither HealthOS</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            O sistema operacional cognitivo para saúde, onde a tecnologia desaparece para o cuidado acontecer.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold mb-6">Selecione seu Ponto de Vista para começar:</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {roles.map(({ role, label, desc, icon: Icon }) => (
              <motion.div
                key={role}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-healthos-ice/50 dark:bg-healthos-ice/10 border border-healthos-ice dark:border-healthos-ice/20 text-left cursor-pointer"
                onClick={() => handleRoleSelect(role as any)}
              >
                <Icon className="h-8 w-8 mb-4 text-healthos-prism-start" />
                <h3 className="font-bold text-lg">{label}</h3>
                <p className="text-sm text-muted-foreground mt-2">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <footer className="absolute bottom-4 text-xs text-muted-foreground">
        Built with ❤️ at Cloudflare
      </footer>
    </div>
  );
}