/* eslint-disable @typescript-eslint/no-explicit-any */
/* 管理者が送信したメッセージ一覧を取得するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages, students } from '@/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const getAdminMessages = new Hono().get('/getAdminMessages', async (c) => {
    try {
        // 送信者IDをクエリパラメータから取得
        const senderId = c.req.query('senderId');

        if (!senderId) {
            return c.json({ error: '送信者IDが必要です' }, 400);
        }

        // メッセージと生徒情報を結合して取得
        const messageList = await db
            .select({
                id: messages.id,
                studentId: messages.studentId,
                studentName: students.name,
                studentGrade: students.grade,
                title: messages.title,
                content: messages.content,
                messageType: messages.messageType,
                messagePriority: messages.messagePriority,
                isRead: messages.isRead,
                sentAt: messages.sentAt,
                scheduledAt: messages.scheduledAt,
                senderId: messages.senderId,
            })
            .from(messages)
            .leftJoin(students, eq(messages.studentId, students.studentId))
            .where(eq(messages.senderId, senderId))
            .orderBy(desc(messages.sentAt));

        // 同じ内容・タイプ・優先度・送信時間のメッセージをグループ化
        const groupedMessages = messageList.reduce((acc, message) => {
            const key = `${message.content}-${message.messageType}-${message.messagePriority}-${message.sentAt}-${message.scheduledAt}`;

            if (!acc[key]) {
                acc[key] = {
                    ...message,
                    recipients: [],
                    totalRecipients: 0,
                    readCount: 0,
                };
            }

            acc[key].recipients.push({
                studentId: message.studentId,
                studentName: message.studentName,
                studentGrade: message.studentGrade,
                isRead: message.isRead,
            });
            acc[key].totalRecipients++;
            if (message.isRead) {
                acc[key].readCount++;
            }

            return acc;
        }, {} as Record<string, any>);

        const groupedMessageList = Object.values(groupedMessages);

        return c.json(
            {
                flg: true,
                messages: groupedMessageList,
            },
            200
        );
    } catch (error) {
        console.error('メッセージ取得エラー:', error);
        return c.json(
            {
                flg: false,
                error: 'メッセージ情報の取得に失敗しました',
            },
            500
        );
    }
});
