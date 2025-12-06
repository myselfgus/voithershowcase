import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo } from './types';
import type { Env } from './core-utils';
// 🤖 AI Extension Point: Add session management features
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private loadedSessions = false;
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureSessionsLoaded(): Promise<void> {
    if (!this.loadedSessions) {
      const stored = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(stored));
      this.loadedSessions = true;
    }
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  // --- Session Management ---
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureSessionsLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureSessionsLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureSessionsLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureSessionsLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  // --- Actor Management ---
  async getActors(type: string): Promise<any[]> {
    const stored: Record<string, any[]> = await this.ctx.storage.get('actors') || {};
    if (!stored[type]) {
      // Seed data if it doesn't exist
      const mockData = [{ id: `${type}_001`, name: type === 'patient' ? 'Maria Silva' : type === 'entity' ? 'Dr. João da Silva' : 'Clínica Bem-Estar', specialty: 'Cardiologia', crm: '12345', address: 'Rua Fictícia, 123' }];
      stored[type] = mockData;
      await this.ctx.storage.put('actors', stored);
      return mockData;
    }
    return stored[type];
  }
  async addActor(type: string, actorData: any): Promise<any> {
    let stored: Record<string, any[]> = await this.ctx.storage.get('actors') || {};
    if (!stored[type]) stored[type] = [];
    const id = `${type}_${crypto.randomUUID()}`;
    const newActor = { id, ...actorData };
    stored[type].push(newActor);
    await this.ctx.storage.put('actors', stored);
    return newActor;
  }
  async updateActor(type: string, id: string, actorData: any): Promise<any | null> {
    let stored: Record<string, any[]> = await this.ctx.storage.get('actors') || {};
    if (!stored[type]) return null;
    const actorIndex = stored[type].findIndex((actor: any) => actor.id === id);
    if (actorIndex === -1) return null;
    const updatedActor = { ...stored[type][actorIndex], ...actorData };
    stored[type][actorIndex] = updatedActor;
    await this.ctx.storage.put('actors', stored);
    return updatedActor;
  }
  async deleteActor(type: string, id: string): Promise<boolean> {
    let stored: Record<string, any[]> = await this.ctx.storage.get('actors') || {};
    if (!stored[type]) return false;
    const initialLength = stored[type].length;
    stored[type] = stored[type].filter((actor: any) => actor.id !== id);
    if (stored[type].length === initialLength) return false;
    await this.ctx.storage.put('actors', stored);
    return true;
  }
}