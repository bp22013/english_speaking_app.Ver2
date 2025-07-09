import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/server/lib/getSession'; // Lucia セッション取得関数

export const getStudentMessages = new Hono().get('/getStudentMessages', async (c) => {
    try {
        const session = await getSession(c);

        if (!session) {
            return c.json({ flg: false, error: '認証情報が見つかりません' }, 401);
        }

        const studentId = session.userId;

        const result = await db
            .select()
            .from(messages)
            .where(eq(messages.studentId, studentId))
            .orderBy(desc(messages.sentAt));

        return c.json({
            flg: true,
            messages: result,
        });
    } catch (err) {
        console.error(err);
        return c.json({ flg: false, error: 'メッセージの取得に失敗しました' }, 500);
    }
});
