/* 生徒プロフィール更新API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

interface UpdateStudentProfileRequest {
    studentId: string;
    name: string;
    grade: string;
}

export const updateStudentProfile = new Hono()
    .post('/updateStudentProfile', async (c) => {
        try {
            const { studentId, name, grade }: UpdateStudentProfileRequest = await c.req.json();

            // バリデーション
            if (!studentId || !name || !grade) {
                return c.json({
                    flg: false,
                    message: '必要な情報が不足しています'
                }, 400);
            }

            // 生徒の存在確認
            const existingStudent = await db
                .select()
                .from(students)
                .where(eq(students.studentId, studentId))
                .limit(1);

            if (existingStudent.length === 0) {
                return c.json({
                    flg: false,
                    message: '生徒が見つかりません'
                }, 404);
            }

            // プロフィール更新
            await db
                .update(students)
                .set({
                    name,
                    grade,
                })
                .where(eq(students.studentId, studentId));

            return c.json({
                flg: true,
                message: 'プロフィールを更新しました'
            }, 200);

        } catch (error) {
            console.error('プロフィール更新エラー:', error);
            return c.json({
                flg: false,
                message: 'プロフィールの更新に失敗しました'
            }, 500);
        }
    });