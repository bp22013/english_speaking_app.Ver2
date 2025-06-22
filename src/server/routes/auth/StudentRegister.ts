import { Hono } from 'hono';

export const studentRegister = new Hono().get('/studentRegister', (c) => {
    return c.json({ message: 'Student Registered!' });
});
