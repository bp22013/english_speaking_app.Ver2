// routes/studentApp.ts
import { Hono } from 'hono';
import { studentAuthMiddleware } from './student/studentMiddleware';

export const studentApp = new Hono();

studentApp.use('*', studentAuthMiddleware);

studentApp.get('/', (c) => c.text('生徒トップ'));
studentApp.get('/dashboard', (c) => c.text('ダッシュボード'));
studentApp.get('/training', (c) => c.text('トレーニング'));
studentApp.get('/message', (c) => c.text('メッセージ'));
studentApp.get('/setting', (c) => c.text('設定'));
