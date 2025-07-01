/* 生徒を削除するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import {
    students,
    users,
    studentWordStatus,
    studentStatistics,
    messages,
} from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const DeleteStudent = new Hono().post('/deleteStudent', async (c) => {
    try {
        const { studentId } = await c.req.json();

        const user = await db.select().from(students).where(eq(students.studentId, studentId));

        if (!user || user.length === 0) {
            return c.json({ message: 'その生徒は存在しません', flg: false }, 404);
        }

        await db.delete(studentWordStatus).where(eq(studentWordStatus.studentId, studentId));
        await db.delete(studentStatistics).where(eq(studentStatistics.studentId, studentId));
        await db.delete(messages).where(eq(messages.studentId, studentId));
        await db.delete(users).where(eq(users.studentId, studentId));
        await db.delete(students).where(eq(students.studentId, studentId));

        return c.json({ message: '対象の生徒を削除しました!', flg: true }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ message: 'サーバーエラーが発生しました', flg: false }, 500);
    }
});
