// middlewares/studentAuthMiddleware.ts
import { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { lucia } from '@/lib/auth/lucia'; // Lucia初期化済みのインスタンス
import { db } from '@/server/db'; // DrizzleのDBクライアント
import { sessions } from '@/server/db/schema'; // sessionテーブルのDrizzle schema
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export const studentAuthMiddleware: MiddlewareHandler = async (c, next) => {
    console.log('www');
    // ① CookieからセッションID取得
    const sessionId = getCookie(c, 'auth_session');
    if (!sessionId) {
        return c.redirect('/');
    }

    // ② Luciaでセッション認証
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session || !user) {
        return c.redirect('/');
    }

    // ③ DBで session.isActive をチェック（Drizzle）
    const [sessionRecord] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId)) // LuciaのセッションIDと一致する行を探す
        .limit(1);

    if (!sessionRecord?.isActive) {
        return c.redirect('/');
    }
    // ④ パス
    await next();
};
