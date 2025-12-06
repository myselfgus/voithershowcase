import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { stageManifests } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { FileText } from '@phosphor-icons/react';
const SectionHeader: React.FC<{ title: string; subtitle: string; }> = ({ title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-block p-4 bg-healthos-ice dark:bg-healthos-ice/10 rounded-full mb-4"
    >
      <FileText className="w-8 h-8 text-healthos-prism-start" />
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
export function StageViewer() {
  const [selectedStage, setSelectedStage] = useState<keyof typeof stageManifests>('medscribe');
  return (
    <AppLayout container>
      <div className="py-8 md:py-10 lg:py-12">
        <SectionHeader
          title="Visualizador de Manifestos"
          subtitle="Inspecione as configurações declarativas de cada Stage da plataforma HealthOS."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <GlassCard>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <Select value={selectedStage} onValueChange={(value) => setSelectedStage(value as keyof typeof stageManifests)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Selecione um Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(stageManifests).map((key) => (
                      <SelectItem key={key} value={key} className="capitalize">
                        {stageManifests[key as keyof typeof stageManifests].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button disabled>Editar Manifesto</Button>
              </div>
              <div className="bg-healthos-ice/30 dark:bg-healthos-ice/5 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono text-healthos-ink dark:text-healthos-porcelain">
                  <code>
                    {stageManifests[selectedStage].manifest}
                  </code>
                </pre>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AppLayout>
  );
}