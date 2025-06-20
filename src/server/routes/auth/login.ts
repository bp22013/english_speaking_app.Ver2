import { Hono } from 'hono';

export const adminLogin = new Hono();

adminLogin.post('/', (c) => {
    return c.json({});
});
