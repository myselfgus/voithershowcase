import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, CubeFocus, LockKey, ShieldCheck, Sparkle, Waveform } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BreathingSphere } from '@/components/visual/BreathingSphere';
import { ParticleFlow } from '@/components/visual/ParticleFlow';
import { WaveformViz } from '@/components/visual/WaveformViz';
import { CapsuleGrid } from '@/components/visual/CapsuleGrid';
import { GlassCard } from '@/components/ui/GlassCard';
import { ecosystemModules } from '@/lib/mockData';
import styles from '@/styles/homepage.module.css';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';
const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <section className={cn("py-24 md:py-32", className)}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);
const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string; }> = ({ title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="text-4xl md:text-5xl font-bold font-display tracking-tight text-healthos-ink dark:text-healthos-porcelain"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-4 text-lg text-muted-foreground"
    >
      {subtitle}
    </motion.p>
  </div>
);
function HeroSection() {
  const [text, setText] = useState("burocracia");
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (prefersReducedMotion) {
      setText("invisível");
      return;
    }
    const timeout = setTimeout(() => {
      setText("invisível");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className={styles.heroBackground}></div>
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-healthos-ink dark:text-healthos-porcelain"
        >
          A medicina virou{' '}
          <span className="relative inline-block">
            <span className={cn("transition-all duration-500", text === "invisível" ? "text-gradient-prism" : "")}>
              {text}
            </span>
          </span>
          <br />
          Nós a tornamos invisível.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground"
        >
          HealthOS é um sistema operacional cognitivo para saúde que automatiza 100% da documentação, retornando o foco para a relação médico-paciente.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10"
        >
          <Button size="lg" onClick={() => document.getElementById('medscribe')?.scrollIntoView()}>
            Veja como <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 dark:opacity-30 -z-10"
      >
        <BreathingSphere />
      </motion.div>
    </section>
  );
}
export function HomePage() {
  return (
    <div className="bg-healthos-porcelain dark:bg-healthos-ink text-healthos-ink dark:text-healthos-porcelain">
      <ThemeToggle />
      <main>
        <HeroSection />
        <Section id="medscribe">
          <SectionHeader
            title={<>Do caos da fala à <span className="text-gradient-prism">clareza clínica</span></>}
            subtitle="O MedScribe transforma conversas não estruturadas em documentação médica precisa e organizada, em tempo real."
          />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="h-96"
            >
              <ParticleFlow />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold font-display">Nota SOAP Gerada por IA</h3>
                  <p><strong className="text-healthos-ink/80 dark:text-healthos-porcelain/80">S:</strong> Paciente relata dor abdominal...</p>
                  <p><strong className="text-healthos-ink/80 dark:text-healthos-porcelain/80">O:</strong> Sinal de Murphy positivo...</p>
                  <p><strong className="text-healthos-ink/80 dark:text-healthos-porcelain/80">A:</strong> Suspeita de colecistite aguda...</p>
                  <p><strong className="text-healthos-ink/80 dark:text-healthos-porcelain/80">P:</strong> Solicitar ultrassonografia...</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </Section>
        <Section>
          <SectionHeader
            title="Nossa tecnologia escuta o que não é dito"
            subtitle="A Análise Semântica Latente (ASL) proprietária da HealthOS identifica padrões clínicos sutis na fala do paciente, revelando insights que seriam perdidos."
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <WaveformViz />
          </motion.div>
        </Section>
        <Section>
          <SectionHeader
            title="Soberania de dados, por design"
            subtitle="No HealthOS, cada paciente é uma cápsula de dados isolada e soberana, em contraste com a vulnerabilidade de bancos de dados tradicionais."
          />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold font-display mb-4">HealthOS: PatientActors</h3>
              <CapsuleGrid />
              <p className="mt-4 text-muted-foreground">Cada paciente controla o acesso aos seus dados. Seguro, isolado e soberano.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold font-display mb-4">Sistema Legado</h3>
              <div className="p-8 bg-red-500/10 rounded-2xl">
                <LockKey size={64} className="mx-auto text-red-500" />
              </div>
              <p className="mt-4 text-muted-foreground">Dados misturados, vulneráveis e controlados por terceiros.</p>
            </motion.div>
          </div>
        </Section>
        <Section>
          <SectionHeader
            title="Um ecossistema, infinitas possibilidades"
            subtitle="HealthOS é uma plataforma extensível. Nossos 'Stages' são apps modulares que se conectam para criar soluções de saúde completas."
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
                    <mod.icon size={32} className="mx-auto text-healthos-prism-start mb-4" />
                    <h3 className="font-bold">{mod.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{mod.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </Section>
        <footer className="py-8 border-t border-healthos-ice dark:border-healthos-ice/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Voither. Todos os direitos reservados. Built with ❤️ at Cloudflare.</p>
            <p className="mt-2 text-xs">O uso de capacidades de IA pode estar sujeito a limites de requisição.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}