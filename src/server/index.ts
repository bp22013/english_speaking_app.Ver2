import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import authApp from './routes/auth';

const app = new Hono();

app.use('*', cors());
app.use(csrf());
app.use(logger());

export const route = app.route('/auth', authApp);

export type AppType = typeof route;
export default app;
