/* 生徒パスワード変更API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

interface ChangePasswordRequest {
    studentId: string;
    currentPassword: string;
    newPassword: string;
}

export const changeStudentPassword = new Hono().post('/changeStudentPassword', async (c) => {
    try {
        const { studentId, currentPassword, newPassword }: ChangePasswordRequest =
            await c.req.json();

        // 生徒の存在確認
        const student = await db
            .select()
            .from(students)
            .where(eq(students.studentId, studentId))
            .limit(1);

        if (student.length === 0) {
            return c.json(
                {
                    flg: false,
                    message: '生徒が見つかりません',
                },
                404
            );
        }

        // 現在のパスワード確認
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            student[0].passwordHash
        );
        if (!isCurrentPasswordValid) {
            return c.json(
                {
                    flg: false,
                    message: '現在のパスワードが正しくありません',
                },
                400
            );
        }

        // 新しいパスワードをハッシュ化（saltRounds: 12）
        const saltRounds = 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // パスワード更新
        await db
            .update(students)
            .set({
                passwordHash: newPasswordHash,
            })
            .where(eq(students.studentId, studentId));

        return c.json(
            {
                flg: true,
                message: 'パスワードを変更しました!',
            },
            200
        );
    } catch (error) {
        console.log('パスワード変更エラー:', error);
        return c.json(
            {
                flg: false,
                message: 'サーバーエラーが発生しました',
            },
            500
        );
    }
});
