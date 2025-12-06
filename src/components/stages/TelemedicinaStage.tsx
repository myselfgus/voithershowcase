import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { AccessGrantModal } from '@/components/ui/AccessGrantModal';
import { Video, PhoneOff, Sparkle, Signature } from 'lucide-react';
import { useCurrentRole } from '@/stores/useRoleStore';
function MockVideoFeed() {
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
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#3a3a3a';
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 0.2 + frame * 0.01) * 0.4 + 0.5) * width;
        const y = (Math.cos(i * 0.3 + frame * 0.02) * 0.4 + 0.5) * height;
        const r = (Math.sin(i * 0.5 + frame * 0.03) * 0.4 + 0.6) * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return <canvas ref={canvasRef} className="w-full h-full object-cover rounded-md" />;
}
export function TelemedicinaStage() {
  const [showConsent, setShowConsent] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const role = useCurrentRole();
  useEffect(() => {
    setShowConsent(role === 'patient');
  }, [role]);
  const handleStartCall = () => {
    setInCall(true);
    toast.info('Chamada de telemedicina iniciada.');
  };
  const handleEndCall = async () => {
    setInCall(false);
    setIsProcessing(true);
    toast.info('Gerando resumo da consulta remota...');
    const mockTranscript = "Consulta de acompanhamento para hipertensão. Paciente relata boa adesão ao tratamento com Losartana 50mg. Pressão arterial aferida em casa está em média 130/85 mmHg. Sem queixas novas. Plano: Manter medicação, retornar em 3 meses.";
    const systemPrompt = `Você é um assistente médico. Gere um resumo conciso e estruturado da consulta de telemedicina a partir da transcrição fornecida para um POV de "${role}".`;
    let accumulatedSummary = '';
    await chatService.sendMessage(mockTranscript, 'google-ai-studio/gemini-2.5-flash', (chunk) => {
      accumulatedSummary += chunk;
      setSummary(accumulatedSummary);
    }, systemPrompt);
    await chatService.sendMessage(`Execute o script para "consulta_fim" no POV ${role}`);
    setIsProcessing(false);
    toast.success('Resumo da consulta remota gerado.');
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>App de Telemedicina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg mb-4 relative">
            <AnimatePresence>
              {inCall && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                  <MockVideoFeed />
                </motion.div>
              )}
            </AnimatePresence>
            {!inCall && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Aguardando início da chamada...</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            {!inCall ? (
              <Button size="lg" onClick={handleStartCall} disabled={showConsent && role === 'patient'}>
                <Video className="mr-2 h-5 w-5" /> Iniciar Chamada
              </Button>
            ) : (
              <Button size="lg" variant="destructive" onClick={handleEndCall}>
                <PhoneOff className="mr-2 h-5 w-5" /> Encerrar Chamada
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {(isProcessing || summary) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Sparkle /> Resumo AI da Consulta Remota</div>
              <Badge variant="destructive">Assinatura Digital Requerida</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing && !summary ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <Textarea value={summary} readOnly={role !== 'professional'} rows={8} />
            )}
            {role === 'professional' && summary && (
              <Button><Signature className="mr-2 h-4 w-4" /> Assinar Digitalmente a Consulta</Button>
            )}
          </CardContent>
        </Card>
      )}
      <AccessGrantModal open={showConsent && role === 'patient'} onOpenChange={(open) => {
        if (!open) setShowConsent(false);
      }} />
    </div>
  );
}