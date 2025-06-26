/* 生徒の情報とセッション状況を取得するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { sessions, students } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllStudents = new Hono().get('/getStudentInfo', async (c) => {
    try {
        // すべての生徒を取得
        const studentList = await db.select().from(students);

        // 各生徒ごとにセッションを確認し、有効なセッションがあるかどうか判定
        const result = await Promise.all(
            studentList.map(async (student) => {
                const sessionList = await db
                    .select()
                    .from(sessions)
                    .where(eq(sessions.userId, student.id));

                // 有効なセッションが1つでもあれば true、それ以外は false
                const isSessionActive = sessionList.some((s) => s.isActive === true);

                return {
                    studentId: student.studentId,
                    name: student.name,
                    grade: student.grade,
                    lastLoginAt: student.lastLoginAt,
                    registeredAt: student.registeredAt,
                    isActive: isSessionActive,
                };
            })
        );

        return c.json({ sessions: result }, 200);
    } catch (error) {
        console.error('セッション取得エラー:', error);
        return c.json({ error: 'セッション情報の取得に失敗しました' }, 500);
    }
});
