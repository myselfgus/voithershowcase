import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleScripts } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Code, Play, Terminal } from '@phosphor-icons/react';
import { toast } from 'sonner';
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
  const handleRunScript = () => {
    setSimulationOutput('Iniciando simulação...\n');
    toast.info(`Executando script: ${selectedScript.id}`);
    let output = '';
    selectedScript.steps.forEach((step, index) => {
      setTimeout(() => {
        output += `[Passo ${index + 1}] Trigger: ${step.trigger} -> Ativando: ${step.activate}\n`;
        if (step.actions) {
          step.actions.forEach(action => {
            output += `  -> Ação: Gerar ${action.generate}\n`;
          });
        }
        setSimulationOutput(prev => prev + output);
        output = ''; // Reset for next step
      }, (index + 1) * 750);
    });
    setTimeout(() => {
      setSimulationOutput(prev => prev + 'Simulação concluída.');
      toast.success('Script executado com sucesso!');
    }, (selectedScript.steps.length + 1) * 750);
  };
  return (
    <AppLayout container>
      <div className="py-8 md:py-10 lg:py-12">
        <SectionHeader
          title="Editor de Scripts"
          subtitle="Visualize os fluxos declarativos que definem 'como as coisas acontecem' em cada Stage."
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          <GlassCard className="lg:col-span-1">
            <div className="p-6">
              <h3 className="font-bold mb-4">Scripts Disponíveis</h3>
              <ul className="space-y-2">
                {sampleScripts.map(script => (
                  <li key={script.id}>
                    <Button
                      variant={selectedScript.id === script.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedScript(script);
                        setSimulationOutput('');
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
                  <Button onClick={handleRunScript}>
                    <Play className="mr-2 h-4 w-4" />
                    Simular Execução
                  </Button>
                </div>
                <Accordion type="single" collapsible defaultValue="item-0">
                  {selectedScript.steps.map((step, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>Passo {index + 1}: {step.trigger}</AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-healthos-ice/30 dark:bg-healthos-ice/5 rounded-md p-4 font-mono text-sm">
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
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </GlassCard>
            {simulationOutput && (
              <Card className="bg-healthos-ink text-healthos-porcelain font-mono">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Terminal />
                    Saída da Simulação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap">{simulationOutput}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}