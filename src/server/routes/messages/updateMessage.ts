/* メッセージを編集するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

export const updateMessage = new Hono().post('/updateMessage', async (c) => {
    try {
        const { messageId, content, messageType, messagePriority, scheduledAt, senderId } =
            await c.req.json();

        if (!messageId) {
            return c.json({ flg: false, message: 'メッセージIDが必要です' }, 400);
        }

        if (!senderId) {
            return c.json({ flg: false, message: '送信者IDが必要です' }, 400);
        }

        if (!content || !content.trim()) {
            return c.json({ flg: false, message: 'メッセージ内容が必要です' }, 400);
        }

        // 対象メッセージを検索
        const targetMessage = await db
            .select()
            .from(messages)
            .where(and(eq(messages.id, messageId), eq(messages.senderId, senderId)))
            .limit(1);

        if (targetMessage.length === 0) {
            return c.json(
                { flg: false, message: 'メッセージが見つからないか、編集権限がありません' },
                404
            );
        }

        const {
            content: oldContent,
            messageType: oldType,
            messagePriority: oldPriority,
            sentAt,
            scheduledAt: oldScheduledAt,
        } = targetMessage[0];

        // 同じ内容・タイプ・優先度・送信時間のメッセージを全て更新
        const conditions = [eq(messages.senderId, senderId)];

        // oldContentがnullの場合とnullでない場合を分けて処理
        if (oldContent !== null) {
            conditions.push(eq(messages.content, oldContent));
        } else {
            conditions.push(isNull(messages.content));
        }

        // sentAtがnullの場合とnullでない場合を分けて処理
        if (sentAt !== null) {
            conditions.push(eq(messages.sentAt, sentAt));
        } else {
            conditions.push(isNull(messages.sentAt));
        }

        // oldTypeがnullの場合とnullでない場合を分けて処理
        if (oldType !== null) {
            conditions.push(eq(messages.messageType, oldType));
        } else {
            conditions.push(isNull(messages.messageType));
        }

        // oldPriorityがnullの場合とnullでない場合を分けて処理
        if (oldPriority !== null) {
            conditions.push(eq(messages.messagePriority, oldPriority));
        } else {
            conditions.push(isNull(messages.messagePriority));
        }

        // oldScheduledAtがnullの場合とnullでない場合を分けて処理
        if (oldScheduledAt !== null) {
            conditions.push(eq(messages.scheduledAt, oldScheduledAt));
        } else {
            conditions.push(isNull(messages.scheduledAt));
        }

        await db
            .update(messages)
            .set({
                content: content.trim(),
                messageType: messageType || null,
                messagePriority: messagePriority || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            })
            .where(and(...conditions));

        return c.json(
            {
                flg: true,
                message: 'メッセージを更新しました',
            },
            200
        );
    } catch (error) {
        console.error('メッセージ更新エラー:', error);
        return c.json(
            {
                flg: false,
                message: 'メッセージの更新に失敗しました',
            },
            500
        );
    }
});
