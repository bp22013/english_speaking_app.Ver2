/* 全単語の情報を取得するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { words } from '@/server/db/schema';

export const GetWords = new Hono().get('/getWords', async (c) => {
    try {
        // データベースからすべての単語情報を取得
        const allWords = await db.select().from(words);

        return c.json({ flg: true, data: allWords }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
