import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BreathingSphere } from '@/components/visual/BreathingSphere';
import { ParticleFlow } from '@/components/visual/ParticleFlow';
import { WaveformViz } from '@/components/visual/WaveformViz';
import { CapsuleGrid } from '@/components/visual/CapsuleGrid';
import { GlassCard } from '@/components/ui/GlassCard';
import { ecosystemModules } from '@/lib/mockData';
import { NeumorphicButton } from '@/components/ui/NeumorphicButton';
import styles from '@/styles/homepage.module.css';
import { Toaster } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`py-24 md:py-32 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);
const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string; }> = ({ title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-healthos-ink dark:text-healthos-porcelain">
      {title}
    </h2>
    <p className="mt-4 text-lg text-muted-foreground">
      {subtitle}
    </p>
  </div>
);
function HeroSection() {
  const [text, setText] = useState("burocracia");
  const [isMorphed, setIsMorphed] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isMorphed) {
        setIsMorphed(true);
        setTimeout(() => setText("invisível"), 250);
      } else if (window.scrollY <= 10 && isMorphed) {
        setIsMorphed(false);
        setTimeout(() => setText("burocracia"), 250);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMorphed]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className={styles.heroBackground} />
      <ThemeToggle />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-balance"
        >
          A medicina virou{' '}
          <span className="relative inline-block">
            <span className={`absolute inset-0 bg-gradient-prism transition-all duration-500 ${isMorphed ? 'opacity-100 blur-xl' : 'opacity-0 blur-none'}`} />
            <span className={`${styles.liquidText} ${isMorphed ? 'scale-110 text-gradient-prism' : 'scale-100'}`}>
              {text}
            </span>
          </span>
          .
          <br />
          Nós a tornamos invisível.
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 max-w-xs mx-auto"
        >
          <BreathingSphere />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <p className="text-sm">Role para explorar</p>
        <ArrowDown className="animate-bounce" />
      </motion.div>
      <div className="absolute bottom-20">
        <NeumorphicButton onClick={() => navigate('/dashboard')}>
          Entrar no HealthOS
        </NeumorphicButton>
      </div>
    </section>
  );
}
export function HomePage() {
  return (
    <div className="bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain">
      <Toaster />
      <HeroSection />
      <main>
        <Section>
          <SectionHeader
            title="Do caos à clareza, instantaneamente."
            subtitle="HealthOS MedScribe transforma conversas não estruturadas em documentação clínica precisa, liberando o médico para focar no que importa: o paciente."
          />
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div className="h-96">
              <ParticleFlow />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <GlassCard>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Transcrição Automatizada</h3>
                  <p className="text-muted-foreground mt-2">Escuta ambiente que captura e estrutura a consulta em tempo real.</p>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Nota SOAP Inteligente</h3>
                  <p className="text-muted-foreground mt-2">Geração de notas SOAP com um clique, prontas para validação.</p>
                </div>
              </GlassCard>
              <GlassCard>
                <div className="p-6">
                  <h3 className="font-bold text-lg">Insights Clínicos</h3>
                  <p className="text-muted-foreground mt-2">A IA identifica padrões e alertas relevantes na fala do paciente.</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </Section>
        <Section>
          <SectionHeader
            title="Ouvindo o que não é dito."
            subtitle="Nossa tecnologia proprietária de Análise Semântica da Linguagem (ASL) vai além das palavras, identificando biomarcadores vocais para insights clínicos mais profundos."
          />
          <WaveformViz />
        </Section>
        <Section>
          <SectionHeader
            title={<>Soberania de Dados. <br />Não é uma feature, é a arquitetura.</>}
            subtitle="Cada paciente é um 'PatientActor' soberano, um cofre de dados isolado. Acesso? Só com a sua permissão. O modelo tradicional de 'banco de dados compartilhado' está obsoleto."
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-center mb-4">HealthOS: Cofres Isolados</h3>
              <CapsuleGrid />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Legado: Banco de Dados Único</h3>
              <p className="text-5xl p-16 bg-red-500/10 border border-red-500/20 rounded-2xl">🗑️</p>
              <p className="mt-4 text-muted-foreground">Vulnerável, fragmentado e sem controle real do paciente.</p>
            </div>
          </div>
        </Section>
        <Section>
          <SectionHeader
            title="Um ecossistema, não apenas um app."
            subtitle="HealthOS é a base para um universo de aplicações de saúde. Cada 'Stage' é um app focado que utiliza os mesmos atores universais, garantindo integração nativa."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemModules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="p-6 text-center">
                    <div className="inline-block p-3 bg-healthos-ice dark:bg-healthos-ice/10 rounded-full mb-4">
                      <mod.icon className="w-6 h-6 text-healthos-prism-start" />
                    </div>
                    <h3 className="font-bold">{mod.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{mod.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Section>
      </main>
      <footer className="py-12 bg-healthos-ice/50 dark:bg-healthos-ice/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-display">Pronto para tornar a tecnologia invisível?</h2>
          <p className="mt-4 text-muted-foreground">Agende uma demonstração e veja como o HealthOS pode transformar o cuidado em sua instituição.</p>
          <div className="mt-8">
            <NeumorphicButton asChild size="lg">
              <a href="mailto:demo@voither.com">Solicitar Demo</a>
            </NeumorphicButton>
          </div>
          <p className="mt-12 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Voither. Todos os direitos reservados. <br />
            O uso de modelos de IA está sujeito a limites de requisição. Built with ❤️ at Cloudflare.
          </p>
        </div>
      </footer>
    </div>
  );
}