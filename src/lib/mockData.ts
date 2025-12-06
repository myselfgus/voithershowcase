import { PenNib, ArrowsClockwise, Calendar, Monitor } from '@phosphor-icons/react';
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
    icon: PenNib,
  },
  {
    id: "regulation",
    name: "Regulação",
    description: "Central de regulação inteligente para otimizar fluxos.",
    icon: ArrowsClockwise,
  },
  {
    id: "agenda",
    name: "Agenda",
    description: "Agendamento dinâmico e preditivo para clínicas e hospitais.",
    icon: Calendar,
  },
  {
    id: "telemedicine",
    name: "Telemedicina",
    description: "Plataforma segura e integrada para consultas remotas.",
    icon: Monitor,
  },
];
export const stageManifests = {
  medscribe: {
    name: 'MedScribe Module',
    manifest: `stage:
  id: "medscribe-module"
  name: "MedScribe Module"
tools:
  - id: "ambient-listener"
    category: "capability"
    mcpTools:
      - name: "start_transcription"
  - id: "documenter"
    category: "capability"
    mcpTools:
      - name: "generate_soap_note"
personas:
  - id: "transcriber-assistant"
    agent:
      model: "claude-sonnet-4-20250514"
      systemPrompt: "Você é um assistente de documentação médica no módulo MedScribe."
    tools: ["ambient-listener"]
  - id: "documenter-assistant"
    agent:
      model: "claude-opus-4-20250514"
      systemPrompt: "Você é um especialista em documentação clínica. Gere uma nota SOAP precisa."
    tools: ["documenter"]
    guardrails:
      - type: "require_validation"
scripts:
  - id: "consultation-workflow"
    steps:
      - trigger: "consulta_inicio"
        activate: "transcriber-assistant"
      - trigger: "consulta_fim"
        activate: "documenter-assistant"
        actions:
          - generate: "soap_note"`
  },
  regulation: {
    name: 'Regulation Center',
    manifest: `stage:
  id: "regulation-center"
  name: "Regulation Center"
tools:
  - id: "patient-matcher"
    category: "capability"
    mcpTools:
      - name: "find_best_service"
personas:
  - id: "regulator-assistant"
    agent:
      model: "claude-sonnet-4-20250514"
      systemPrompt: "Você é um assistente de regulação. Encontre a melhor unidade para o paciente."
    tools: ["patient-matcher"]
    guardrails:
      - type: "require_validation"
scripts:
  - id: "regulation-workflow"
    steps:
      - trigger: "novo_pedido_regulacao"
        activate: "regulator-assistant"`
  }
};
export const sampleScripts = [
  {
    id: "consultation-workflow",
    steps: [
      {
        trigger: "consulta_inicio",
        activate: "ambient-listener",
      },
      {
        trigger: "consulta_fim",
        activate: "documenter",
        actions: [
          { generate: "soap_note" },
          { generate: "billing_code_suggestion" }
        ],
      },
    ],
  },
  {
    id: "regulation-workflow",
    steps: [
      {
        trigger: "novo_pedido_regulacao",
        activate: "patient-matcher",
      },
      {
        trigger: "servico_encontrado",
        activate: "notifier",
        actions: [
          { generate: "notify_patient" },
          { generate: "notify_service" }
        ],
      },
    ],
  },
];
export const marketplacePartners = [
  {
    name: "Clínica Inova",
    description: "Módulo de gestão de fluxo de pacientes para clínicas de especialidades, otimizando a jornada do paciente desde a chegada até a alta.",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "LabData Analytics",
    description: "Integração direta com laboratórios para visualização e análise de resultados de exames, com alertas inteligentes para médicos.",
    logo: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "TelePsico+",
    description: "Plataforma de telepsicologia com ferramentas de análise de sentimento e acompanhamento de progresso terapêutico.",
    logo: "https://images.unsplash.com/photo-1584433144853-169dd62217af?q=80&w=200&auto=format&fit=crop",
  },
];