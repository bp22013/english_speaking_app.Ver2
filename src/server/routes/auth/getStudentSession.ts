/* useLuciaAuth用のセッション取得API */

import { Hono } from 'hono';
import { getSession } from '../../lib/getSession';
import { students, sessions } from '@/server/db/schema';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';

export const hookSession = new Hono().get('/useSession', async (c) => {
    const session = await getSession(c);

    if (!session) {
        return c.json({ user: null, sessionId: null, flg: false });
    }

    const student = await db
        .select({
            studentId: students.studentId,
            name: students.name,
            grade: students.grade,
            registeredAt: students.registeredAt,
            lastLoginAt: students.lastLoginAt,
        })
        .from(students)
        .where(eq(students.id, session.userId));

    const sessionId = await db
        .select({ sessionId: sessions.id })
        .from(sessions)
        .where(eq(sessions.userId, session.userId));

    if (!student[0]) {
        return c.json({ user: null, sessionId: null, flg: false });
    }

    return c.json({
        user: { ...student[0], sessionId: sessionId[0]?.sessionId ?? null },
        sessionId: sessionId,
        flg: true,
    });
});
