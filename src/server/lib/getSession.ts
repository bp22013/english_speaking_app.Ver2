import { lucia } from './lucia';
import { getCookie } from 'hono/cookie';
import type { Context } from 'hono';

export const getSession = async (c: Context) => {
    const sessionId = getCookie(c, lucia.sessionCookieName);

    if (!sessionId) return null;

    try {
        const { session } = await lucia.validateSession(sessionId);
        return session;
    } catch {
        return null;
    }
};
