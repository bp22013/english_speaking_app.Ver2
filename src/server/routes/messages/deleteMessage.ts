/* メッセージを削除するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const deleteMessage = new Hono()
    .get('/deleteMessage/test', async (c) => {
        return c.json({ flg: true, message: 'Delete API is working' });
    })
    .post('/deleteMessage', async (c) => {
    try {
        const { messageIds, senderId } = await c.req.json();
        
        if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
            return c.json({ flg: false, message: 'メッセージIDが必要です' }, 400);
        }
        
        if (!senderId) {
            return c.json({ flg: false, message: '送信者IDが必要です' }, 400);
        }

        // 対象メッセージを検索（同じ内容・タイプ・優先度・送信時間のもの）
        const targetMessage = await db
            .select()
            .from(messages)
            .where(and(
                eq(messages.id, messageIds[0]),
                eq(messages.senderId, senderId)
            ))
            .limit(1);

        if (targetMessage.length === 0) {
            return c.json({ flg: false, message: 'メッセージが見つからないか、削除権限がありません' }, 404);
        }

        const { content, messageType, messagePriority, sentAt, scheduledAt } = targetMessage[0];

        // 同じ内容・タイプ・優先度・送信時間のメッセージを全て削除
        const conditions = [
            eq(messages.senderId, senderId),
            eq(messages.content, content),
            eq(messages.sentAt, sentAt)
        ];

        if (messageType !== null) {
            conditions.push(eq(messages.messageType, messageType));
        }
        if (messagePriority !== null) {
            conditions.push(eq(messages.messagePriority, messagePriority));
        }
        if (scheduledAt !== null) {
            conditions.push(eq(messages.scheduledAt, scheduledAt));
        }

        const result = await db
            .delete(messages)
            .where(and(...conditions));

        return c.json({
            flg: true,
            message: 'メッセージを削除しました'
        }, 200);
    } catch (error) {
        console.error('メッセージ削除エラー:', error);
        return c.json({ 
            flg: false,
            message: 'メッセージの削除に失敗しました' 
        }, 500);
    }
});