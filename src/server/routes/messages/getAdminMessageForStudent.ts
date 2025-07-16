/* メッセージを取得するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages, students, admins } from '@/server/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { getSession } from '@/server/lib/getSession';

export const getStudentMessages = new Hono().get('/getStudentMessages', async (c) => {
    try {
        const session = await getSession(c);

        if (!session) {
            return c.json({ flg: false, error: '認証情報が見つかりません' }, 401);
        }

        const studentPrimaryId = session.userId;

        const studentRecord = await db
            .select()
            .from(students)
            .where(eq(students.id, studentPrimaryId))
            .limit(1);

        if (!studentRecord.length) {
            return c.json({ flg: false, error: '生徒情報が見つかりません' }, 404);
        }

        const studentId = studentRecord[0].studentId;

        const result = await db
            .select()
            .from(messages)
            .where(eq(messages.studentId, studentId))
            .orderBy(desc(messages.sentAt));

        if (!result.length) {
            return c.json({ flg: true, messages: [], adminName: null });
        }

        // すべて同じsenderIdなので、先頭のメッセージから取得
        const senderId = result[0].senderId;

        const adminRecord = await db.select().from(admins).where(eq(admins.id, senderId)).limit(1);

        const adminName = adminRecord.length ? adminRecord[0].name : '不明な送信者';

        return c.json({
            flg: true,
            messages: result,
            adminName,
        });
    } catch (err) {
        console.error(err);
        return c.json({ flg: false, error: 'メッセージの取得に失敗しました' }, 500);
    }
});
