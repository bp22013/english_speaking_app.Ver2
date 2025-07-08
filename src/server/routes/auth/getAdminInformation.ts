/* Adminの情報取得用API */

import { Hono } from 'hono';
import { admins } from '@/server/db/schema';
import { db } from '@/server/db';

export const hookSession = new Hono().get('/useAdminSession', async (c) => {
    const admin = await db.select().from(admins);

    if (!admin[0]) {
        return c.json({ user: null, sessionId: null, flg: false });
    }

    return c.json({
        user: { ...admin[0] },
        flg: true,
    });
});
