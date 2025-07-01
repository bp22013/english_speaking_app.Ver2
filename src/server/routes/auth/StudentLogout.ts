/* 生徒のログアウト用API */

import { Hono } from 'hono';
import { lucia } from '@/server/lib/lucia';
import { deleteCookie } from 'hono/cookie';
import { sessions, students } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';

export const studentLogout = new Hono().post('/studentLogout', async (c) => {
    try {
        const { sessionId, studentId } = await c.req.json();
        const now = new Date();

        if (!sessionId) {
            return c.json({ error: 'ログインセッションが存在しません', flg: false }, 401);
        } else if (!studentId) {
            return c.json({ error: '生徒IDを取得できませんでした', flg: false }, 401);
        }

        // セッションを無効化
        await lucia.invalidateSession(sessionId);

        // クッキーを削除
        deleteCookie(c, lucia.sessionCookieName);

        // セッションテーブルのフラグを無効化
        await db.update(sessions).set({ isActive: false }).where(eq(sessions.id, sessionId));
        await db
            .update(students)
            .set({ lastLoginAt: now })
            .where(eq(students.studentId, studentId));

        return c.json({ message: 'ログアウトしました', flg: true });
    } catch (error) {
        console.error('ログアウトエラー:', error);
        return c.json({ error: 'ログアウトに失敗しました', flg: false }, 500);
    }
});
