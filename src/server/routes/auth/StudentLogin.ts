/* 生徒のログインAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/auth/lucia';
import { setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';

const studentLogin = new Hono().post('/studentLogin', async (c) => {
    try {
        const body = await c.req.json();
        const { studentId, password } = body;

        const result = await db.select().from(users).where(eq(users.studentId, studentId)).limit(1);

        const user = result[0];
        if (!user) {
            return c.json({ error: '生徒が存在しません', flg: false }, 401);
        } else if (!(await bcrypt.compare(password, user.passwordHash))) {
            return c.json({ error: '生徒IDまたはパスワードが違います', flg: false }, 401);
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return c.json({ message: 'ログインしました!', flg: true });
    } catch (error) {
        console.log(`例外エラー: ${error}`);
        return c.json({ error: `サーバーエラーが発生しました ${error}`, flg: false }, 500);
    }
});

export default studentLogin;
