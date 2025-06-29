/* 生徒を削除するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { students, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const DeleteStudent = new Hono().post('/deleteStudent', async (c) => {
    try {
        const { studentId } = await c.res.json();

        const user = await db.select().from(students).where(eq(students.studentId, studentId));

        if (!user) {
            return c.json({ message: 'その生徒は存在しません', flg: false }, 401);
        }

        // 対称性とに関するデータを全て削除
        await db.delete(students).where(studentId);
        await db.delete(users).where(studentId);

        return c.json({ message: '対象の生徒を削除しました!', flg: true }, 200);
    } catch (error) {
        console.log(error);
        return c.json({ message: 'サーバーエラーが発生しました', flg: false }, 500);
    }
});
