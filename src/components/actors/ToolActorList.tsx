import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCurrentRole } from '@/stores/useRoleStore';
interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}
export function ToolActorList() {
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = useCurrentRole();
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTools([
        {
          type: 'function',
          function: {
            name: 'get_weather',
            description: 'Obter informações climáticas atuais para uma localidade.',
            parameters: { type: 'object', properties: { location: { type: 'string' } } },
          },
        },
        {
          type: 'function',
          function: {
            name: 'web_search',
            description: 'Pesquisar na web ou buscar conteúdo de uma URL específica.',
            parameters: { type: 'object', properties: { query: { type: 'string' }, url: { type: 'string' } } },
          },
        },
        {
          type: 'function',
          function: {
            name: 'start_transcription',
            description: 'Inicia a escuta ambiente para uma consulta médica.',
            parameters: { type: 'object', properties: {} },
          },
        },
        {
          type: 'function',
          function: {
            name: 'generate_soap_note',
            description: 'Gera uma nota SOAP a partir da transcrição de uma consulta.',
            parameters: { type: 'object', properties: { transcript: { type: 'string' } } },
          },
        },
      ]);
      setIsLoading(false);
    };
    fetchTools();
  }, []);
  if (!['professional', 'service'].includes(role)) {
    return (
      <Card>
        <CardHeader><CardTitle>Acesso Restrito</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A visualização de ferramentas de saúde está disponível apenas para profissionais e serviços.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot className="h-6 w-6" /> Ferramentas de Saúde (MCPs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {tools.map(tool => (
                <AccordionItem key={tool.function.name} value={tool.function.name}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Wrench />
                      Ferramenta: {tool.function.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">{tool.function.description}</p>
                    <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                      <code>{JSON.stringify(tool.function.parameters, null, 2)}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}