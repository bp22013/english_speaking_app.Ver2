/* 単語を削除するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { studentWordStatus, words } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const deleteWord = new Hono().post('/deleteWords', async (c) => {
    try {
        const { id } = await c.req.json();

        if (!id) {
            return c.json({ flg: false, message: '単語が存在しません' }, 400);
        }
        await db.delete(studentWordStatus).where(eq(studentWordStatus.wordId, id));
        await db.delete(words).where(eq(words.id, id));
        return c.json({ flg: true, message: '単語を削除しました!' }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
