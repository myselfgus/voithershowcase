import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { chatService } from '@/lib/chat';
import { useCurrentRole } from '@/stores/useRoleStore';
import { Play, AlertTriangle, CheckCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const sampleScript = `stage:
  id: "consultation-flow"
steps:
  - trigger: "consultation_start"
    activate: "ambient-listener"
    automation: "auto_execute"
  - trigger: "consultation_end"
    activate: "documenter"
    automation: "require_validation"
    actions:
      - generate: "soap_note"`;
export function ScriptRunner() {
  const [yaml, setYaml] = useState(sampleScript);
  const [persona, setPersona] = useState('claude-sonnet');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const role = useCurrentRole();
  const handleRun = async () => {
    setIsLoading(true);
    setOutput('Iniciando execução do script...\n\n');
    const prompt = `Simule a execução do seguinte script YAML para um POV de "${role}" usando a persona "${persona}". Respeite os níveis de automação (auto_execute, require_validation). Descreva cada passo e o resultado.
    YAML:
    ${yaml}`;
    let accumulatedResponse = '';
    await chatService.sendMessage(
      prompt,
      'google-ai-studio/gemini-2.5-flash',
      (chunk) => {
        accumulatedResponse += chunk;
        setOutput(accumulatedResponse);
      }
    );
    setIsLoading(false);
    toast.success('Simulação de script concluída!');
  };
  const renderOutput = () => {
    return output.split('\n').map((line, index) => {
      let icon = null;
      if (line.toLowerCase().includes('auto_execute')) {
        icon = <CheckCircle className="h-4 w-4 text-green-500 inline-block mr-2" />;
      } else if (line.toLowerCase().includes('require_validation')) {
        icon = <AlertTriangle className="h-4 w-4 text-yellow-500 inline-block mr-2" />;
      }
      return <div key={index}>{icon}{line}</div>;
    });
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Orquestrador de Scripts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger><SelectValue placeholder="Selecione a Persona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-sonnet">Claude Sonnet (Padrão)</SelectItem>
                <SelectItem value="gemini-flash">Gemini Flash (Rápido)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRun} disabled={isLoading}>
              <Play className="mr-2 h-4 w-4" />
              {isLoading ? 'Executando...' : 'Executar Script'}
            </Button>
          </div>
          <Textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            placeholder="Cole o YAML do script aqui..."
            rows={12}
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bot /> Saída da Simulação</CardTitle></CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg min-h-[100px]">
            {isLoading && !output ? 'Aguardando resposta da IA...' : renderOutput()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}