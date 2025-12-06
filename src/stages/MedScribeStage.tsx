import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, StopCircle, FileText, Sparkle, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { useCurrentRole } from '@/stores/useRoleStore';
interface SoapNote { S: string; O: string; A: string; P: string; }
interface TranscriptionResult { soapNote: SoapNote; insights: string[]; }
function MockWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    let animationFrameId: number;
    const render = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'hsl(var(--healthos-prism-start))';
      ctx.beginPath();
      const midY = height / 2;
      for (let x = 0; x < width; x++) {
        const y = midY + Math.sin(x * 0.05 + frame * 0.1) * (midY * 0.5);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-16" />;
}
export function MedScribeStage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [editableSoap, setEditableSoap] = useState<SoapNote | null>(null);
  const role = useCurrentRole();
  const handleToggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      toast.info("Processando consulta...", {
        description: "A IA está gerando o documento médico e insights.",
      });
      const result = await chatService.demoMedScribeTranscription();
      if (result.success && result.data) {
        setTranscriptionResult(result.data);
        setEditableSoap(result.data.soapNote);
        toast.success("Processamento do App concluído!");
      } else {
        toast.error("Falha no processamento", {
          description: result.error || "Não foi possível gerar a documentação.",
        });
      }
      setIsProcessing(false);
    } else {
      setIsRecording(true);
      setTranscriptionResult(null);
      setEditableSoap(null);
      toast.info("Escuta ambiente iniciada...", {
        description: "A consulta está sendo gravada para transcrição.",
      });
    }
  };
  const handleSoapChange = (field: keyof SoapNote, value: string) => {
    if (editableSoap) {
      setEditableSoap({ ...editableSoap, [field]: value });
    }
  };
  const handleSaveNote = () => {
    if (editableSoap) {
      localStorage.setItem('savedSoapNote', JSON.stringify(editableSoap));
      toast.success("Nota salva com sucesso!", {
        description: "A nota SOAP foi salva localmente."
      });
    }
  };
  const handleExport = () => {
    if (editableSoap) {
      const blob = new Blob([JSON.stringify(editableSoap, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'soap_note.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.info("Nota exportada como JSON.");
    }
  };
  const isReadOnly = role === 'patient';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText size={24} /> App MedScribe: Documentação AI
            <Badge variant="secondary" className="ml-2">App MedScribe</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {role === 'professional' && (
            <>
              <motion.div
                animate={{ scale: isRecording ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                <Button
                  size="lg"
                  className={`rounded-full h-24 w-24 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  onClick={handleToggleRecording}
                  disabled={isProcessing}
                >
                  {isRecording ? <StopCircle className="h-8 w-8" /> : <Mic size={48} />}
                </Button>
              </motion.div>
              <p className="mt-4 text-muted-foreground">
                {isProcessing ? 'Processando...' : isRecording ? 'Gravando consulta...' : 'Pressione para iniciar a escuta ambiente'}
              </p>
            </>
          )}
          {role !== 'professional' && (
            <p className="text-muted-foreground">Visualização de Documentação. Apenas profissionais podem iniciar gravações.</p>
          )}
          {isRecording && <div className="mt-4"><MockWaveform /></div>}
        </CardContent>
      </Card>
      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader><CardTitle>Gerando Documento Médico...</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {transcriptionResult && editableSoap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Nota SOAP</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(editableSoap).map(([key, value]) => (
                    <div key={key}>
                      <label className="font-semibold uppercase">{key}</label>
                      <Textarea
                        value={value}
                        onChange={e => handleSoapChange(key as keyof SoapNote, e.target.value)}
                        rows={key === 'S' ? 4 : 3}
                        readOnly={isReadOnly}
                        disabled={isReadOnly}
                      />
                    </div>
                  ))}
                  {isReadOnly && <p className="text-xs text-muted-foreground">Visualização de Documento - Edição restrita ao profissional.</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Sparkle /> Insights da IA do App</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {transcriptionResult.insights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end items-center gap-4">
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">Validação Requerida</Badge>
              {role === 'service' && (
                <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Exportar</Button>
              )}
              {role === 'professional' && (
                <Button onClick={handleSaveNote}><Save className="mr-2 h-4 w-4" /> Salvar Nota</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}