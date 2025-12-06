export const waveformData = Array.from({ length: 100 }, (_, i) => {
  const x = i / 99;
  const y = Math.sin(x * Math.PI * 4) * 0.3 + Math.sin(x * Math.PI * 10) * 0.1 + Math.random() * 0.05;
  return y;
});
export const waveformTooltips = [
  {
    position: 15,
    insight: "Hesitação na fala detectada",
    details: "Pausa >250ms, pode indicar incerteza ou busca por palavras.",
  },
  {
    position: 42,
    insight: "Tom de voz elevado",
    details: "Aumento de 8dB na amplitude, pode correlacionar com estresse.",
  },
  {
    position: 78,
    insight: "Padrão de fala rápido",
    details: "Frequência de 4.5Hz, 20% acima da linha de base do paciente.",
  },
];
export const ecosystemModules = [
  {
    id: "medscribe",
    name: "MedScribe",
    description: "Transcrição e documentação AI-nativa para consultas.",
    icon: "PenNib",
  },
  {
    id: "regulation",
    name: "Regulação",
    description: "Central de regulação inteligente para otimizar fluxos.",
    icon: "ArrowsClockwise",
  },
  {
    id: "agenda",
    name: "Agenda",
    description: "Agendamento dinâmico e preditivo para clínicas e hospitais.",
    icon: "Calendar",
  },
  {
    id: "telemedicine",
    name: "Telemedicina",
    description: "Plataforma segura e integrada para consultas remotas.",
    icon: "Monitor",
  },
];