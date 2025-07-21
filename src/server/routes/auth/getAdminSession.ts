/* 管理者のセッション状態と情報を取得するAPI */

import { Hono } from 'hono';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/server/db';
import { admins } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAdminSession = new Hono().get('/getAdminSession', async (c) => {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: sessionError,
        } = await supabase.auth.getUser();

        if (sessionError || !user) {
            return c.json({ flg: false, message: 'セッションが存在しません' }, 401);
        }

        const adminRecord = await db.select().from(admins).where(eq(admins.id, user.id)).limit(1);

        const adminName = adminRecord.length > 0 ? adminRecord[0].name : '未設定';

        return c.json({
            flg: true,
            user: {
                id: user.id,
                name: adminName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('管理者セッション取得エラー:', error);
        return c.json({ flg: false, message: '管理者情報の取得に失敗しました' }, 500);
    }
});
