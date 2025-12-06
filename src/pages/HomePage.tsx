import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown, PenNib, ArrowsClockwise, Calendar, Monitor, LockKey, CubeFocus, ShieldCheck, Sparkle, X } from '@phosphor-icons/react';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeumorphicButton } from '@/components/ui/NeumorphicButton';
import { Skeleton } from '@/components/ui/skeleton';
import { BreathingSphere } from '@/components/visual/BreathingSphere';
import { ParticleFlow } from '@/components/visual/ParticleFlow';
import { WaveformViz } from '@/components/visual/WaveformViz';
import { CapsuleGrid } from '@/components/visual/CapsuleGrid';
import { AccessGrantModal } from '@/components/ui/AccessGrantModal';
import { ecosystemModules } from '@/lib/mockData';
import { chatService } from '@/lib/chat';
import styles from '@/styles/homepage.module.css';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
const Section: React.FC<{ children: React.ReactNode; className?: string; id: string }> = ({ children, className, id }) => (
  <section id={id} className={`w-full ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
      {children}
    </div>
  </section>
);
const SectionHeader: React.FC<{ title: string; subtitle: string; label: string }> = ({ title, subtitle, label }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <Badge variant="outline" className="mb-4">{label}</Badge>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight">{title}</h2>
    <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
  </div>
);
const iconMap: Record<string, React.ElementType> = {
  PenNib, ArrowsClockwise, Calendar, Monitor, LockKey, CubeFocus, ShieldCheck
};
interface SoapNote { S: string; O: string; A: string; P: string; }
interface TranscriptionResult { soapNote: SoapNote; insights: string[]; }
export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const sphereScale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const sphereY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleTranscriptionDemo = async () => {
    setIsTranscribing(true);
    setTranscription(null);
    toast.info("Iniciando demonstração do MedScribe...", {
      description: "A IA está processando a transcrição da consulta.",
    });
    const mockAudioText = "Paciente, 45 anos, sexo masculino, relata dor abdominal intensa no quadrante superior direito há 2 dias, com irradiação para as costas. A dor piora após alimentação gordurosa. Nega febre, mas refere náuseas e um episódio de vômito. Ao exame, abdome doloroso à palpação em hipocôndrio direito, com sinal de Murphy positivo.";
    let accumulatedJson = '';
    try {
      await chatService.demoMedScribeTranscription(mockAudioText, (chunk) => {
        accumulatedJson += chunk;
      });
      const parsed = JSON.parse(accumulatedJson);
      setTranscription(parsed);
      toast.success("Transcrição concluída!");
    } catch (error) {
      console.error("Transcription parsing error:", error);
      toast.error("Falha na demonstração", { description: "Não foi possível processar a transcrição. Tente novamente." });
      setTranscription(null);
    } finally {
      setIsTranscribing(false);
    }
  };
  return (
    <div className="bg-healthos-porcelain text-healthos-ink antialiased">
      <div className={styles.heroBackground} />
      <ThemeToggle />
      <Toaster richColors closeButton />
      <AccessGrantModal open={showAccessModal} onOpenChange={setShowAccessModal} />
      {/* Hero Section */}
      <section ref={heroRef} className="h-screen min-h-[700px] flex flex-col justify-center items-center text-center relative overflow-hidden p-4">
        <motion.div
          style={prefersReducedMotion ? {} : { scale: sphereScale, y: sphereY }}
          className="w-64 h-64 md:w-96 md:h-96 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        >
          <BreathingSphere />
        </motion.div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tighter"
          >
            A medicina virou
            <br />
            <span className={`${styles.liquidText} text-gradient-prism transition-all duration-500`}>
              {isScrolled ? "invisível." : "burocracia."}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          >
            HealthOS é um sistema operacional cognitivo para saúde que torna a tecnologia invisível, devolvendo o foco para a relação médico-paciente.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 animate-bounce text-muted-foreground" />
        </motion.div>
      </section>
      {/* MedScribe Section */}
      <Section id="medscribe" className="bg-white/50 dark:bg-black/20">
        <SectionHeader
          label="A Transformação"
          title="Do Caos à Clareza Clínica"
          subtitle="Veja como o MedScribe transforma conversas não estruturadas em documentação precisa e acionável, em tempo real."
        />
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative h-64 md:h-96">
            <ParticleFlow />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-prism rounded-full shadow-prism-glow flex items-center justify-center">
                <PenNib weight="fill" className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <ShieldCheck weight="fill" className="w-8 h-8 text-healthos-prism-start flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Automação de Documentação</h3>
                <p className="text-muted-foreground">Geração automática de notas SOAP, resumos e encaminhamentos.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck weight="fill" className="w-8 h-8 text-healthos-prism-start flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg">Insights Estruturados</h3>
                <p className="text-muted-foreground">Extração de diagnósticos, medicamentos e planos em formato estruturado.</p>
              </div>
            </div>
            <div className="text-center md:text-left pt-4">
              <NeumorphicButton onClick={handleTranscriptionDemo} disabled={isTranscribing}>
                {isTranscribing ? 'Processando...' : 'Demonstração ao Vivo'}
              </NeumorphicButton>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {(isTranscribing || transcription) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12"
            >
              <GlassCard>
                <div className="p-6 md:p-8 relative">
                  <h3 className="text-xl font-bold font-display mb-4">Resultado da Transcrição</h3>
                  {isTranscribing ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/4 mt-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : transcription && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Nota SOAP</h4>
                        <div className="text-sm space-y-2 text-muted-foreground">
                          <p><strong>S:</strong> {transcription.soapNote.S}</p>
                          <p><strong>O:</strong> {transcription.soapNote.O}</p>
                          <p><strong>A:</strong> {transcription.soapNote.A}</p>
                          <p><strong>P:</strong> {transcription.soapNote.P}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Insights da IA</h4>
                        <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                          {transcription.insights.map((insight, i) => <li key={i}>{insight}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
      {/* ASL Deep Tech Section */}
      <Section id="asl">
        <SectionHeader
          label="O Moat Tecnológico"
          title="Análise Semântica da Linguagem (ASL)"
          subtitle="Nossa tecnologia proprietária vai além da transcrição, detectando padrões sutis na fala que podem indicar condições clínicas."
        />
        <div className="max-w-4xl mx-auto">
          <GlassCard>
            <div className="p-6 md:p-8">
              <WaveformViz />
            </div>
          </GlassCard>
        </div>
      </Section>
      {/* Architecture Section */}
      <Section id="architecture" className="bg-white/50 dark:bg-black/20">
        <SectionHeader
          label="Soberania do Paciente"
          title="Arquitetura de Dados Inviolável"
          subtitle="HealthOS foi desenhado com um princípio fundamental: o paciente é o único soberano de seus dados. Cada paciente é uma cápsula de dados isolada e criptografada."
        />
        <div className="max-w-4xl mx-auto">
          <CapsuleGrid />
        </div>
      </Section>
      {/* Ecosystem Section */}
      <Section id="ecosystem">
        <SectionHeader
          label="O Futuro da Saúde"
          title="Um Ecossistema, Infinitas Possibilidades"
          subtitle="HealthOS é uma plataforma sobre a qual novos 'Stages' (aplicativos) de saúde podem ser construídos, todos compartilhando os mesmos Actors e dados soberanos."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ecosystemModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onMouseEnter={mod.id === 'telemedicine' ? () => setShowAccessModal(true) : undefined}
                className="h-full"
              >
                <GlassCard className="transition-all duration-300 hover:shadow-prism-glow hover:-translate-y-1 h-full">
                  <div className="p-6 text-center flex flex-col items-center justify-start h-full">
                    <div className="inline-block p-4 bg-healthos-ice dark:bg-healthos-ice/10 rounded-full mb-4">
                      <Icon className="w-8 h-8 text-healthos-prism-start" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{mod.name}</h3>
                    <p className="text-muted-foreground text-sm flex-grow">{mod.description}</p>
                    {mod.id === 'telemedicine' && <Badge variant="outline" className="mt-4">Passe o mouse para demo</Badge>}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
            <Button variant="outline" asChild>
                <Link to="/marketplace">Explorar Marketplace de Stages</Link>
            </Button>
        </div>
      </Section>
      {/* Footer */}
      <footer className="border-t border-healthos-ice">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Voither HealthOS. Todos os direitos reservados.</p>
            <p className="mt-2">Construído com ❤️ na Cloudflare.</p>
            <div className="mt-4">
                <Button variant="link" asChild>
                    <Link to="/stages">Acessar Portal do Desenvolvedor</Link>
                </Button>
            </div>
            <Separator className="my-4 max-w-xs mx-auto" />
            <p className="text-xs max-w-2xl mx-auto">
              Nota: A capacidade de requisições de IA é limitada — a cota é compartilhada entre aplicativos; uso intenso pode sofrer limitação de taxa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}