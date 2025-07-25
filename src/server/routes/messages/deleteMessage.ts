/* メッセージを削除するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export const deleteMessage = new Hono().post('/deleteMessage', async (c) => {
    try {
        const { messageIds, senderId, studentId } = await c.req.json();

        if (!messageIds) {
            return c.json({ flg: false, message: 'メッセージIDが必要です' }, 400);
        }

        if (!senderId) {
            return c.json({ flg: false, message: '送信者IDが必要です' }, 400);
        }

        if (!studentId) {
            return c.json({ flg: false, message: '生徒IDが必要です' }, 400);
        }

        console.log('削除対象 studentId:', studentId);

        const targetMessage = await db
            .select()
            .from(messages)
            .where(
                and(
                    eq(messages.id, messageIds),
                    eq(messages.senderId, senderId),
                    eq(messages.studentId, studentId)
                )
            )
            .limit(1);

        if (targetMessage.length === 0) {
            return c.json(
                { flg: false, message: 'メッセージが見つからないか、削除権限がありません' },
                404
            );
        }

        const { content, messageType, messagePriority, sentAt, scheduledAt } = targetMessage[0];

        const conditions = [eq(messages.senderId, senderId), eq(messages.studentId, studentId)];

        // content が null の場合と null でない場合を分けて処理
        if (content !== null) {
            conditions.push(eq(messages.content, content));
        } else {
            conditions.push(isNull(messages.content));
        }

        // sentAt が null の場合と null でない場合を分けて処理
        if (sentAt !== null) {
            conditions.push(eq(messages.sentAt, sentAt));
        } else {
            conditions.push(isNull(messages.sentAt));
        }

        // messageType が null の場合と null でない場合を分けて処理
        if (messageType !== null) {
            conditions.push(eq(messages.messageType, messageType));
        } else {
            conditions.push(isNull(messages.messageType));
        }

        // messagePriority が null の場合と null でない場合を分けて処理
        if (messagePriority !== null) {
            conditions.push(eq(messages.messagePriority, messagePriority));
        } else {
            conditions.push(isNull(messages.messagePriority));
        }

        // scheduledAt が null の場合と null でない場合を分けて処理
        if (scheduledAt !== null) {
            conditions.push(eq(messages.scheduledAt, scheduledAt));
        } else {
            conditions.push(isNull(messages.scheduledAt));
        }

        await db.delete(messages).where(and(...conditions));

        return c.json(
            {
                flg: true,
                message: 'メッセージを削除しました',
            },
            200
        );
    } catch (error) {
        console.error('メッセージ削除エラー:', error);
        return c.json(
            {
                flg: false,
                message: 'メッセージの削除に失敗しました',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            },
            500
        );
    }
});
