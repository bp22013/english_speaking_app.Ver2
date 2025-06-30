/* 単語を登録するAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { words, students, studentWordStatus } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const RegisterWords = new Hono().post('/RegisterWords', async (c) => {
    try {
        const { word, meaning, level } = await c.req.json();
        const newWordId = crypto.randomUUID();
        const now = new Date();

        // 重複チェック
        const exists = await db
            .select()
            .from(words)
            .where(and(eq(words.word, word), eq(words.meaning, meaning)));

        if (exists.length > 0) {
            return c.json({ message: 'その単語は既に登録されています', flg: false }, 409);
        }

        // 単語を登録
        await db.insert(words).values({
            id: newWordId,
            word,
            meaning,
            level,
            addedAt: now,
        });

        // 生徒全員取得
        const allStudents = await db.select().from(students);

        // 各生徒に対して未回答状態のステータスを作成
        const statusEntries = allStudents.map((student) => ({
            id: crypto.randomUUID(),
            studentId: student.id,
            wordId: newWordId,
            isCorrect: null,
            answeredAt: null,
            answeredFlag: false,
        }));

        // 一括挿入
        await db.insert(studentWordStatus).values(statusEntries);

        return c.json({ message: '単語を新規登録しました!', flg: true }, 200);
    } catch (error) {
        console.error(error);
        return c.json({ message: 'サーバーエラーが発生しました', flg: false }, 500);
    }
});
