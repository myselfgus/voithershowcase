import type { Message, ChatState, ToolCall, WeatherResult, MCPResult, ErrorResult, SessionInfo } from '../../worker/types';
import { errorReporter } from '@/lib/errorReporter';
export interface ErrorReport {
  message: string;
  level: 'info' | 'warning' | 'error';
  url: string;
  timestamp: string;
  userAgent?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
interface SoapNote { S: string; O: string; A: string; P: string; }
interface TranscriptionResult { soapNote: SoapNote; insights: string[]; }
interface DemoResponse {
  success: boolean;
  data?: TranscriptionResult;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'google-ai-studio/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
];
export const medscribeSystemPrompt = `
      Você é o MedScribe, um assistente de IA especializado em documentação médica.
      Transcreva a seguinte consulta em uma nota SOAP (Subjetivo, Objetivo, Avaliação, Plano).
      Seja conciso, preciso e use terminologia médica apropriada.
      Formate a saída como um objeto JSON com as chaves "soapNote" e "insights".
      A chave "soapNote" deve conter um objeto com as chaves "S", "O", "A", "P".
      A chave "insights" deve ser um array de strings com 2-3 pontos importantes ou alertas.
      Apenas retorne o objeto JSON, sem nenhum texto ou formatação adicional.
    `;
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  async sendMessage(
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void,
    systemPrompt?: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk, systemPrompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) onChunk(chunk);
          }
        } finally {
          reader.releaseLock();
        }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      const err = error as Error;
      errorReporter.report({
        message: err.message,
        level: 'error',
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        error: err,
      });
      return { success: false, error: 'Failed to send message' };
    }
  }
  async demoMedScribeTranscription(): Promise<DemoResponse> {
    const mockAudioText = "Paciente, 45 anos, sexo masculino, relata dor abdominal intensa no quadrante superior direito há 2 dias, com irradiação para as costas. A dor piora após alimentação gordurosa. Nega febre, mas refere náuseas e um episódio de vômito. Ao exame, abdome doloroso à palpação em hipocôndrio direito, com sinal de Murphy positivo.";
    const fallbackData: TranscriptionResult = {
      soapNote: {
        S: "Paciente relata dor abdominal intensa no quadrante superior direito.",
        O: "Sinal de Murphy positivo à palpação.",
        A: "Colecistite aguda.",
        P: "Solicitar ultrassonografia abdominal e iniciar antibioticoterapia."
      },
      insights: ["Sinal de Murphy positivo é um forte indicador de colecistite.", "Monitorar sinais de complicação como febre alta."]
    };
    try {
      let accumulatedJson = '';
      const tempSessionId = crypto.randomUUID();
      await this.createSession('MedScribe Demo', tempSessionId);
      const originalSessionId = this.sessionId;
      this.switchSession(tempSessionId);
      await this.sendMessage(mockAudioText, 'google-ai-studio/gemini-2.5-pro', (chunk) => {
        accumulatedJson += chunk;
      }, medscribeSystemPrompt);
      this.switchSession(originalSessionId);
      await this.deleteSession(tempSessionId);
      const cleanJson = accumulatedJson.replace(/```json\n?|\n?```/g, '').trim();
      try {
        const parsed = JSON.parse(cleanJson);
        return { success: true, data: parsed };
      } catch (parseError) {
        console.error("JSON parsing error in demo:", parseError, "Raw response:", accumulatedJson, "Cleaned response:", cleanJson);
        const err = parseError as Error;
        errorReporter.report({
          message: 'MedScribe JSON parse failed',
          level: 'error',
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          context: { rawResponse: accumulatedJson, cleanedJson: cleanJson },
          error: err,
        });
        return { success: true, data: fallbackData }; // Return fallback on parse error
      }
    } catch (error) {
      console.error("MedScribe demo failed:", error);
      const err = error as Error;
      errorReporter.report({
        message: err.message,
        level: 'error',
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        error: err,
      });
      return { success: false, error: 'Demo failed', data: fallbackData }; // Return fallback on network/API error
    }
  }
  async getMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/messages`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get messages:', error);
      return { success: false, error: 'Failed to load messages' };
    }
  }
  async clearMessages(): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to clear messages:', error);
      return { success: false, error: 'Failed to clear messages' };
    }
  }
  getSessionId(): string { return this.sessionId; }
  newSession(): void {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  switchSession(sessionId: string): void {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${sessionId}`;
  }
  async createSession(title?: string, sessionId?: string, firstMessage?: string): Promise<{ success: boolean; data?: { sessionId: string; title: string }; error?: string }> {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sessionId, firstMessage })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to create session' };
    }
  }
  async listSessions(): Promise<{ success: boolean; data?: SessionInfo[]; error?: string }> {
    try {
      const response = await fetch('/api/sessions');
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to list sessions' };
    }
  }
  async deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to delete session' };
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to update session title' };
    }
  }
  async clearAllSessions(): Promise<{ success: boolean; data?: { deletedCount: number }; error?: string }> {
    try {
      const response = await fetch('/api/sessions', { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to clear all sessions' };
    }
  }
  async updateModel(model: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to update model:', error);
      return { success: false, error: 'Failed to update model' };
    }
  }
}
export const chatService = new ChatService();
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const generateSessionTitle = (firstUserMessage?: string): string => {
  const now = new Date();
  const dateTime = now.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  if (!firstUserMessage || !firstUserMessage.trim()) return `Chat ${dateTime}`;
  const cleanMessage = firstUserMessage.trim().replace(/\s+/g, ' ');
  const truncated = cleanMessage.length > 40 ? cleanMessage.slice(0, 37) + '...' : cleanMessage;
  return `${truncated} • ${dateTime}`;
};
export const renderToolCall = (toolCall: ToolCall): string => {
  const result = toolCall.result as WeatherResult | MCPResult | ErrorResult | undefined;
  if (!result) return `⚠️ ${toolCall.name}: No result`;
  if ('error' in result) return `❌ ${toolCall.name}: ${result.error}`;
  if ('content' in result) return `🔧 ${toolCall.name}: Executed`;
  if (toolCall.name === 'get_weather') {
    const weather = result as WeatherResult;
    return `🌤️ Weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}`;
  }
  return `🔧 ${toolCall.name}: Done`;
};