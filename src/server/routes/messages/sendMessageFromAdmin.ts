/* 管理者から生徒にメッセージを送信するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { inArray } from 'drizzle-orm';
import { students } from '../../db/schema';

export const sendMessageFromAdmin = new Hono().post('/sendMessageFromAdmin', async (c) => {
    try {
        const body = await c.req.json();
        console.log('Request Body:', body);

        const {
            senderId,
            title,
            content,
            messageType,
            messagePriority,
            scheduledAt,
            sendToAll,
            selectedStudentIds = [],
            selectedGrades = [],
        } = body;

        const now = new Date();
        let targetStudentIds: string[] = [];

        if (sendToAll) {
            const allStudents = await db.select({ studentId: students.studentId }).from(students);
            console.log('All Students:', allStudents);
            targetStudentIds = allStudents.map((s) => s.studentId);
        } else {
            const studentsByGrade = selectedGrades.length
                ? await db
                      .select({ studentId: students.studentId })
                      .from(students)
                      .where(inArray(students.grade, selectedGrades))
                : [];

            const studentsById = selectedStudentIds.length
                ? await db
                      .select({ studentId: students.studentId })
                      .from(students)
                      .where(inArray(students.studentId, selectedStudentIds))
                : [];

            console.log('Students by Grade:', studentsByGrade);
            console.log('Students by ID:', studentsById);

            const combined = [...studentsByGrade, ...studentsById];
            targetStudentIds = Array.from(new Set(combined.map((s) => s.studentId)));
        }

        console.log('Target Student IDs:', targetStudentIds);

        if (targetStudentIds.length === 0) {
            return c.json({ flg: false, message: '送信対象の生徒が存在しません' }, 400);
        }

        await db.insert(messages).values(
            targetStudentIds.map((studentId) => ({
                id: crypto.randomUUID(),
                studentId,
                senderId,
                title,
                content,
                messageType: messageType || null,
                messagePriority: messagePriority || null,
                sentAt: scheduledAt ? null : now,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                isRead: false,
            }))
        );

        return c.json({
            flg: true,
            message: `${targetStudentIds.length}件のメッセージを送信しました!`,
        });
    } catch (error) {
        console.log(error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
