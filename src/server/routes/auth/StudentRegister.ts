/* 生徒を登録するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { users, students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const studentRegister = new Hono().post('/studentRegister', async (c) => {
    try {
        const { studentId, name, password, grade } = await c.req.json();

        const exists = await db.select().from(users).where(eq(users.studentId, studentId));
        if (exists.length > 0) {
            return c.json({ error: 'この生徒IDは既に登録されています', flg: false }, 409);
        }

        const stretch = Number(process.env.SALT_HASH);
        const hashedPassword = await bcrypt.hash(password, stretch);
        const newUserId = crypto.randomUUID();
        const now = new Date();

        await db.insert(users).values({
            id: newUserId,
            studentId,
            name,
            passwordHash: hashedPassword,
        });

        await db.insert(students).values({
            id: newUserId,
            studentId,
            name,
            passwordHash: hashedPassword,
            grade: grade ?? null,
            registeredAt: now,
        });

        return c.json({ flg: true, message: '生徒を新規登録しました!' }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ error: 'サーバーエラーが発生しました', flg: false }, 500);
    }
});
