import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
interface ActorsStorage {
    [key: string]: any[];
}
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // --- SESSION MANAGEMENT ---
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json().catch(() => ({}));
        const { title, sessionId: providedSessionId } = body;
        const sessionId = providedSessionId || crypto.randomUUID();
        await registerSession(c.env, sessionId, title);
        return c.json({ success: true, data: { sessionId, title } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const deleted = await unregisterSession(c.env, sessionId);
        return c.json({ success: deleted, data: { deleted } });
    });
    // --- HEALTHOS ACTOR MANAGEMENT ---
    app.get('/api/actors/:type', async (c) => {
        const { type } = c.req.param();
        const controller = getAppController(c.env);
        const actors = await controller.getActors(type);
        return c.json({ success: true, data: actors });
    });
    app.post('/api/actors/:type', async (c) => {
        const { type } = c.req.param();
        const body = await c.req.json();
        const controller = getAppController(c.env);
        const newActor = await controller.addActor(type, body);
        return c.json({ success: true, data: newActor }, 201);
    });
    app.put('/api/actors/:type/:id', async (c) => {
        const { type, id } = c.req.param();
        const body = await c.req.json();
        const controller = getAppController(c.env);
        const updatedActor = await controller.updateActor(type, id, body);
        if (!updatedActor) return c.json({ success: false, error: 'Not found' }, 404);
        return c.json({ success: true, data: updatedActor });
    });
    app.delete('/api/actors/:type/:id', async (c) => {
        const { type, id } = c.req.param();
        const controller = getAppController(c.env);
        const success = await controller.deleteActor(type, id);
        if (!success) return c.json({ success: false, error: 'Not found' }, 404);
        return c.json({ success: true });
    });
    // --- HEALTHOS MOCK ROUTES ---
    app.get('/api/status', (c) => {
        return c.json({
            success: true,
            data: {
                activeFlows: Math.floor(Math.random() * 5),
                actorsManaged: 150 + Math.floor(Math.random() * 50),
                stagesActive: 4,
            }
        });
    });
}