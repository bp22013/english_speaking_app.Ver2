import { Hono } from 'hono';

const adminLogin = new Hono()
    .get('/adminLogin', (c) => {
        return c.json({ message: 'Admin Logged in!' });
    })
    .get('/studentLogin', (c) => {
        return c.json({ message: 'Admin Logged in!' });
    });

export default adminLogin;
