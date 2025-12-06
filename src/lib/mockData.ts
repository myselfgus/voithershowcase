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
    name: 'MedScribe',
    manifest: `stage:
  id: "medscribe"
  name: "MedScribe"
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
  - id: "transcriber-persona"
    agent:
      model: "claude-sonnet-4-20250514"
      systemPrompt: "Você é um assistente de transcrição médica. Ouça a consulta e prepare para documentação."
    tools: ["ambient-listener"]
  - id: "documenter-persona"
    agent:
      model: "claude-opus-4-20250514"
      systemPrompt: "Você é um especialista em documentação clínica. Gere uma nota SOAP precisa a partir da transcrição."
    tools: ["documenter"]
    guardrails:
      - type: "require_validation"
scripts:
  - id: "consultation-flow"
    steps:
      - trigger: "consultation_start"
        activate: "transcriber-persona"
      - trigger: "consultation_end"
        activate: "documenter-persona"
        actions:
          - generate: "soap_note"`
  },
  regulation: {
    name: 'Regulação',
    manifest: `stage:
  id: "regulation"
  name: "Central de Regulação"
tools:
  - id: "patient-matcher"
    category: "capability"
    mcpTools:
      - name: "find_best_service"
        inputSchema:
          type: "object"
          properties:
            patientId: { type: "string" }
            requiredSpecialty: { type: "string" }
personas:
  - id: "regulator-agent"
    agent:
      model: "claude-sonnet-4-20250514"
      systemPrompt: "Você é um agente de regulação. Encontre a melhor unidade para o paciente com base na necessidade e disponibilidade."
    tools: ["patient-matcher"]
    guardrails:
      - type: "require_validation"
scripts:
  - id: "regulation-request"
    steps:
      - trigger: "new_patient_request"
        activate: "regulator-agent"`
  }
};
export const sampleScripts = [
  {
    id: "consultation-flow",
    steps: [
      {
        trigger: "consultation_start",
        activate: "ambient-listener",
      },
      {
        trigger: "consultation_end",
        activate: "documenter",
        actions: [
          { generate: "soap_note" },
          { generate: "billing_code_suggestion" }
        ],
      },
    ],
  },
  {
    id: "regulation-flow",
    steps: [
      {
        trigger: "new_patient_request",
        activate: "patient-matcher",
      },
      {
        trigger: "service_found",
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
    description: "Stage de gestão de fluxo de pacientes para clínicas de especialidades, otimizando a jornada do paciente desde a chegada até a alta.",
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