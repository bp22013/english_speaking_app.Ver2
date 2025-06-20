import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import adminLogin from './routes/auth/login';

const app = new Hono().basePath('/api');

app.use('*', cors());
app.use(csrf());
app.use(logger());

export const route = app.route('/auth', adminLogin);

export type AppType = typeof route;
export default app;
