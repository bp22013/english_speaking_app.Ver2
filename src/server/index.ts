/* HonoメインApp */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import authApp from './routes/auth';
import wordApp from './routes/words';
import messageApp from './routes/messages';
import trainingApp from './routes/training';

const app = new Hono();

app.use('*', cors());
app.use(csrf());
app.use(logger());

export const route = app
    .route('/api/auth', authApp)
    .route('/api/word', wordApp)
    .route('/api/messages', messageApp)
    .route('/api/training', trainingApp);

export type AppType = typeof route;
export default app;
