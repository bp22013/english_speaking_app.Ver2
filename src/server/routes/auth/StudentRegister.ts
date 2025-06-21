import { Hono } from 'hono';

export const studentRegister = new Hono().post('/studentRegister', (c) => {
    return c.json({ message: 'Student Registered!' });
});
