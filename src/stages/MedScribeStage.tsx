import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Stop, FileText, Sparkle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
interface SoapNote { S: string; O: string; A: string; P: string; }
interface TranscriptionResult { soapNote: SoapNote; insights: string[]; }
export function MedScribeStage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [editableSoap, setEditableSoap] = useState<SoapNote | null>(null);
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording and process
      setIsRecording(false);
      setIsProcessing(true);
      toast.info("Processando consulta...", {
        description: "A IA está gerando a nota SOAP e insights.",
      });
      const result = await chatService.demoMedScribeTranscription();
      if (result.success && result.data) {
        setTranscriptionResult(result.data);
        setEditableSoap(result.data.soapNote);
        toast.success("Processamento concluído!");
      } else {
        toast.error("Falha no processamento", {
          description: result.error || "Não foi possível gerar a documentação.",
        });
      }
      setIsProcessing(false);
    } else {
      // Start recording
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
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText size={24} /> MedScribe: Documentação AI-Nativa
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
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
              {isRecording ? <Stop size={48} /> : <Mic size={48} />}
            </Button>
          </motion.div>
          <p className="mt-4 text-muted-foreground">
            {isProcessing ? 'Processando...' : isRecording ? 'Gravando consulta...' : 'Pressione para iniciar a escuta ambiente'}
          </p>
        </CardContent>
      </Card>
      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader><CardTitle>Gerando Documentação...</CardTitle></CardHeader>
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
            className="grid md:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader><CardTitle>Nota SOAP (Editável)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-semibold">Subjetivo (S)</label>
                  <Textarea value={editableSoap.S} onChange={e => handleSoapChange('S', e.target.value)} rows={4} />
                </div>
                <div>
                  <label className="font-semibold">Objetivo (O)</label>
                  <Textarea value={editableSoap.O} onChange={e => handleSoapChange('O', e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="font-semibold">Avaliação (A)</label>
                  <Textarea value={editableSoap.A} onChange={e => handleSoapChange('A', e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="font-semibold">Plano (P)</label>
                  <Textarea value={editableSoap.P} onChange={e => handleSoapChange('P', e.target.value)} rows={3} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Sparkle /> Insights da IA</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {transcriptionResult.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}