/* 生徒側のメッセージを既読にするAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const markAsRead = new Hono().post('/markAsRead', async (c) => {
    try {
        const { id, studentId } = await c.req.json();

        if (!id || !studentId) {
            return c.json(
                { flg: false, message: 'メッセージIDまたは生徒IDが指定されていません' },
                400
            );
        }

        const result = await db
            .update(messages)
            .set({ isRead: true })
            .where(and(eq(messages.id, id), eq(messages.studentId, studentId)))
            .returning();

        if (!result.length) {
            return c.json({ flg: false, message: '対象のメッセージが見つかりません' }, 404);
        }

        return c.json(
            {
                flg: true,
                message: 'メッセージを既読にしました',
                updatedMessage: result[0],
            },
            200
        );
    } catch (error) {
        console.error('既読化エラー:', error);

        return c.json(
            {
                flg: false,
                message: 'メッセージの既読化に失敗しました',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            },
            500
        );
    }
});
