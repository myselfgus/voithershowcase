import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, FileText, Sparkle, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { useCurrentRole } from '@/stores/useRoleStore';
import { useRaf } from 'react-use';
interface SoapNote { S: string; O: string; A: string; P: string; }
interface TranscriptionResult { soapNote: SoapNote; insights: string[]; }
function MockWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const step = useRaf(1, 0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const render = () => {
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'hsl(var(--healthos-prism-start))';
        ctx.beginPath();
        const midY = height / 2;
        for (let x = 0; x < width; x++) {
          const y = midY + Math.sin(x * 0.05 + step * 0.001) * (midY * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
    };
    render();
  }, [step]);
  return <canvas ref={canvasRef} className="w-full h-16" />;
}
export function MedScribeStage() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [editableSoap, setEditableSoap] = useState<SoapNote | null>(null);
  const role = useCurrentRole();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const handleStopListening = useCallback(async () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch (e) { console.error("Error stopping media recorder:", e); }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (!isListening) return;
    setIsListening(false);
    setIsProcessing(true);
    toast.info("Processando consulta...", { description: "A IA está gerando o documento médico." });
    const result = await chatService.demoMedScribeTranscription();
    if (result.success && result.data) {
      setTranscriptionResult(result.data);
      setEditableSoap(result.data.soapNote);
      toast.success("Processamento concluído!");
    } else {
      toast.error("Falha no processamento", { description: result.error });
    }
    setIsProcessing(false);
  }, [isListening]);
  const handleStartListening = useCallback(async () => {
    if (isListening) return;
    setTranscriptionResult(null);
    setEditableSoap(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(handleStopListening, 3000); // 3s of silence
      };
      mediaRecorderRef.current.start(1000);
      setIsListening(true);
      toast.info("Escuta ambiente iniciada...");
    } catch (err) {
      toast.error("Microfone não disponível ou permissão negada.");
      console.error("getUserMedia error:", err);
    }
  }, [isListening, handleStopListening]);
  useEffect(() => {
    if (role === 'professional' && !isListening) {
      handleStartListening();
    }
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [role, handleStartListening, isListening]);
  const handleSoapChange = (field: keyof SoapNote, value: string) => {
    if (editableSoap) setEditableSoap({ ...editableSoap, [field]: value });
  };
  const handleSaveNote = () => {
    toast.success("Nota salva com sucesso!");
  };
  if (role === 'patient') {
    return (
      <Card>
        <CardHeader><CardTitle>Modo de Visualização</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Como paciente, você pode visualizar a documentação gerada, mas não pode iniciar a gravação ou editar o conteúdo.</p></CardContent>
      </Card>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={24} /> App MedScribe: Documentação AI
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-center p-4">
            <Mic className={`w-12 h-12 mx-auto ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            <p className="mt-4 text-muted-foreground">
              {isProcessing ? 'Processando...' : isListening ? 'Escuta ambiente ativa...' : 'Aguardando microfone...'}
            </p>
          </div>
          {isListening && <div className="mt-4"><MockWaveform /></div>}
        </CardContent>
      </Card>
      <AnimatePresence>
        {transcriptionResult && editableSoap && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Nota SOAP
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Validação Requerida</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(editableSoap).map(([key, value]) => (
                    <div key={key}>
                      <label className="font-semibold uppercase">{key}</label>
                      <Textarea value={value} onChange={e => handleSoapChange(key as keyof SoapNote, e.target.value)} rows={3} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Sparkle /> Insights da IA</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {transcriptionResult.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end items-center gap-4">
              <Button onClick={handleSaveNote}><Save className="mr-2 h-4 w-4" /> Salvar Nota</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}