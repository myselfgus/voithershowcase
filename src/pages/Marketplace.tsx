import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeumorphicButton } from '@/components/ui/NeumorphicButton';
import { Input } from '@/components/ui/input';
import { marketplacePartners } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Storefront, MagnifyingGlass } from '@phosphor-icons/react';
const SectionHeader: React.FC<{ title: string; subtitle: string; }> = ({ title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-block p-4 bg-healthos-ice dark:bg-healthos-ice/10 rounded-full mb-4"
    >
      <Storefront className="w-8 h-8 text-healthos-prism-start" />
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold font-display tracking-tight"
    >
      {title}
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-4 text-lg text-muted-foreground"
    >
      {subtitle}
    </motion.p>
  </div>
);
export function Marketplace() {
  return (
    <AppLayout container>
      <div className="py-8 md:py-10 lg:py-12">
        <SectionHeader
          title="Marketplace de Stages"
          subtitle="Expanda as capacidades do HealthOS com Stages desenvolvidos por parceiros confiáveis."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Buscar por Stages..." className="pl-10" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {marketplacePartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="h-full transition-all duration-300 hover:shadow-prism-glow hover:-translate-y-1">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={partner.logo} alt={`${partner.name} logo`} className="w-16 h-16 rounded-full object-cover" />
                    <h3 className="text-xl font-bold font-display">{partner.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm flex-grow mb-6">{partner.description}</p>
                  <div className="mt-auto">
                    <NeumorphicButton asChild className="w-full">
                      <a href={`mailto:connect@${partner.name.toLowerCase().replace(/\s/g, '')}.com`}>
                        Conectar
                      </a>
                    </NeumorphicButton>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}