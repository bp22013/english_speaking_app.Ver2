/* 単語を更新するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { words } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const updateWord = new Hono().post('/updateWords', async (c) => {
    try {
        const { id, word, meaning, level } = await c.req.json();

        if (!id || !word || !meaning || !level) {
            return c.json({ flg: false, message: '必要なデータが不足しています' }, 400);
        }

        // 単語が存在するか確認
        const existing = await db.select().from(words).where(eq(words.id, id));

        if (existing.length === 0) {
            return c.json({ flg: false, message: '該当する単語が見つかりませんでした' }, 404);
        }

        // 更新処理
        await db
            .update(words)
            .set({
                word,
                meaning,
                level: parseInt(level),
            })
            .where(eq(words.id, id));

        return c.json({ flg: true, message: '単語を更新しました!' }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
