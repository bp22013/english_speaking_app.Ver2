/* セッションの有効期限をチェックするAPI（5分に1回の頻度で監視） */

import { Hono } from 'hono';
import { supabase } from '@/lib/SupabaseClient';
import { db } from '@/server/db';
import { sessions } from '@/server/db/schema';
import { lt, and, inArray, eq } from 'drizzle-orm';

export const sessionCheck = new Hono().get('/sessionCheck', async (c) => {
    try {
        const now = new Date();

        // 全生徒のセッションを取得し、現在時刻を超えているセッションのうち、isActiveがtrueのものを取得
        const expiredSession = await db
            .select()
            .from(sessions)
            .where(and(lt(sessions.expiresAt, now), sessions.isActive));

        // セッション切れのisActiveをfalseに更新
        if (expiredSession.length > 0) {
            const expiredSessionIds = expiredSession.map((s) => s.id);

            await db
                .update(sessions)
                .set({ isActive: false })
                .where(inArray(sessions.id, expiredSessionIds));
        }

        // falseになった列を削除
        await db.delete(sessions).where(eq(sessions.isActive, false));

        // supabaseのアーカイブ化を防ぐ処理
        await supabase.auth.getSession();

        return c.text('OK', 200);
    } catch (error) {
        console.error('Session check failed:', error);
        return c.text('ERROR', 500);
    }
});
