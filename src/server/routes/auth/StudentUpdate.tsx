/* 生徒の情報を更新するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const updateStudent = new Hono().post('/updateStudent', async (c) => {
    try {
        const { studentId, name, grade } = await c.req.json();

        // バリデーション
        if (!studentId || !name) {
            return c.json({ flg: false, message: 'studentIdとnameは必須です' }, 400);
        }

        // 更新するフィールドをまとめる
        const updateData: Partial<typeof students.$inferInsert> = { name };
        if (grade !== undefined) {
            updateData.grade = grade;
        }

        // UPDATE 実行
        const result = await db
            .update(students)
            .set(updateData)
            .where(eq(students.studentId, studentId))
            .returning();

        if (result.length === 0) {
            return c.json({ flg: false, message: '該当する生徒が見つかりませんでした' }, 404);
        }

        return c.json({ flg: true, message: '生徒情報を更新しました' }, 200);
    } catch (error) {
        console.error('[updateStudent]', error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
