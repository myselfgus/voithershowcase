import React, { useState, lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleScripts } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Code, Play, Terminal } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
const Accordion = lazy(() => import('@/components/ui/accordion').then(module => ({ default: module.Accordion })));
const AccordionItem = lazy(() => import('@/components/ui/accordion').then(module => ({ default: module.AccordionItem })));
const AccordionTrigger = lazy(() => import('@/components/ui/accordion').then(module => ({ default: module.AccordionTrigger })));
const AccordionContent = lazy(() => import('@/components/ui/accordion').then(module => ({ default: module.AccordionContent })));
const SectionHeader: React.FC<{ title: string; subtitle: string; }> = ({ title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-block p-4 bg-healthos-ice dark:bg-healthos-ice/10 rounded-full mb-4"
    >
      <Code className="w-8 h-8 text-healthos-prism-start" />
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
export function ScriptEditor() {
  const [selectedScript, setSelectedScript] = useState(sampleScripts[0]);
  const [simulationOutput, setSimulationOutput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const handleRunScript = () => {
    setIsSimulating(true);
    setSimulationOutput('Iniciando simulação...\n');
    toast.info(`Executando regra de workflow: ${selectedScript.id}`);
    const timeouts: NodeJS.Timeout[] = [];
    selectedScript.steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        let output = `[Regra ${index + 1}] Trigger: ${step.trigger} -> Ativando: ${step.activate}\n`;
        if (step.actions) {
          step.actions.forEach(action => {
            output += `  -> Ação: Gerar ${action.generate}\n`;
          });
        }
        setSimulationOutput(prev => prev + output);
      }, (index + 1) * 750);
      timeouts.push(timeout);
    });
    const finalTimeout = setTimeout(() => {
      setSimulationOutput(prev => prev + 'Simulação concluída.');
      toast.success('Workflow executado com sucesso!');
      setIsSimulating(false);
    }, (selectedScript.steps.length + 1) * 750);
    timeouts.push(finalTimeout);
  };
  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="py-8 md:py-10 lg:py-12">
          <SectionHeader
            title="Editor de Regras de Workflow"
            subtitle="Visualize os fluxos declarativos que definem 'como as coisas acontecem' em cada Módulo."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <GlassCard className="lg:col-span-1">
              <div className="p-6">
                <h3 className="font-bold mb-4">Regras Disponíveis</h3>
                <ul className="space-y-2">
                  {sampleScripts.map(script => (
                    <li key={script.id}>
                      <Button
                        variant={selectedScript.id === script.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedScript(script);
                          setSimulationOutput('');
                          setIsSimulating(false);
                        }}
                      >
                        {script.id}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold font-display">{selectedScript.id}</h3>
                    <Button onClick={handleRunScript} disabled={isSimulating} variant={isSimulating ? "secondary" : "default"}>
                      <Play className="mr-2 h-4 w-4" />
                      {isSimulating ? 'Simulando...' : 'Simular Workflow'}
                    </Button>
                  </div>
                  <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                    <Accordion type="single" collapsible defaultValue="item-0" className={prefersReducedMotion ? "transition-none" : ""}>
                      {selectedScript.steps.map((step, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>Regra {index + 1}: {step.trigger}</AccordionTrigger>
                          <AccordionContent>
                            <motion.div
                              initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-healthos-ice/30 dark:bg-healthos-ice/5 rounded-md p-4 font-mono text-sm"
                            >
                              <p><span className="text-muted-foreground">activate:</span> {step.activate}</p>
                              {step.actions && (
                                <div>
                                  <p className="text-muted-foreground">actions:</p>
                                  <ul className="pl-4">
                                    {step.actions.map((action, i) => (
                                      <li key={i}>- generate: {action.generate}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Suspense>
                </div>
              </GlassCard>
              {(simulationOutput || isSimulating) && (
                <Card className="bg-healthos-ink text-healthos-porcelain font-mono">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Terminal />
                      Resultado da Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSimulating && !simulationOutput ? (
                      <Skeleton className="h-32 w-full bg-white/10" />
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap">{simulationOutput}</pre>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}