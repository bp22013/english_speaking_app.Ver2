import { Hono } from 'hono';
import { db } from '@/server/db';
import { messages } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

const markAsRead = new Hono().post('/markAsRead', async (c) => {
    try {
        const { messageId } = c.req.valid('json');

        // データベースでメッセージを既読に更新
        const [updatedMessage] = await db
            .update(studentMessages)
            .set({
                isRead: true,
                updatedAt: new Date(),
            })
            .where(eq(studentMessages.id, messageId))
            .returning();

        if (!updatedMessage) {
            return c.json(
                {
                    success: false,
                    message: 'メッセージが見つかりません',
                },
                404
            );
        }

        return c.json({
            success: true,
            message: 'メッセージが既読になりました',
            data: updatedMessage,
        });
    } catch (error) {
        console.error('既読化エラー:', error);

        return c.json(
            {
                success: false,
                message: 'メッセージの既読化に失敗しました',
                error: process.env.NODE_ENV === 'development' ? error : undefined,
            },
            500
        );
    }
});
