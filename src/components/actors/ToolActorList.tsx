import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Wrench, Info } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  useEffect(() => {
    // Mock fetching tool definitions
    const fetchTools = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setTools([
        {
          type: 'function',
          function: {
            name: 'get_weather',
            description: 'Get current weather information for a location',
            parameters: { type: 'object', properties: { location: { type: 'string' } } },
          },
        },
        {
          type: 'function',
          function: {
            name: 'web_search',
            description: 'Search the web or fetch content from a URL',
            parameters: { type: 'object', properties: { query: { type: 'string' }, url: { type: 'string' } } },
          },
        },
        {
          type: 'function',
          function: {
            name: 'start_transcription',
            description: 'Starts ambient listening for a medical consultation.',
            parameters: { type: 'object', properties: {} },
          },
        },
        {
          type: 'function',
          function: {
            name: 'generate_soap_note',
            description: 'Generates a SOAP note from a consultation transcript.',
            parameters: { type: 'object', properties: { transcript: { type: 'string' } } },
          },
        },
      ]);
      setIsLoading(false);
    };
    fetchTools();
  }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bot size={24} /> Atores de Ferramenta (MCPs)
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
                      {tool.function.name}
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