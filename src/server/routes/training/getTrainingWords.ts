/* レベル別単語取得API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { words } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const getTrainingWords = new Hono()
    .get('/getTrainingWords', async (c) => {
        try {
            const level = c.req.query('level');
            const mode = c.req.query('mode') || 'training'; // training or review

            if (!level) {
                return c.json({
                    flg: false,
                    message: 'レベルが指定されていません'
                }, 400);
            }

            const levelNum = parseInt(level);
            if (levelNum < 1 || levelNum > 10) {
                return c.json({
                    flg: false,
                    message: '無効なレベルです（1-10の範囲で指定してください）'
                }, 400);
            }

            // レベル別の単語を取得
            const wordsData = await db
                .select({
                    id: words.id,
                    word: words.word,
                    meaning: words.meaning,
                    level: words.level,
                })
                .from(words)
                .where(eq(words.level, levelNum))
                .limit(20); // 一回のセッションで最大20問

            if (wordsData.length === 0) {
                return c.json({
                    flg: false,
                    message: `レベル${level}の単語が見つかりません`
                }, 404);
            }

            // ランダムにシャッフル
            const shuffledWords = wordsData.sort(() => Math.random() - 0.5);

            return c.json({
                flg: true,
                data: shuffledWords.map(word => ({
                    id: word.id,
                    word: word.word,
                    answer: word.meaning,
                    level: word.level,
                    hint: `レベル${word.level}の単語`
                })),
                level: levelNum,
                mode,
                totalWords: shuffledWords.length
            }, 200);

        } catch (error) {
            console.error('単語取得エラー:', error);
            return c.json({
                flg: false,
                message: '単語の取得に失敗しました'
            }, 500);
        }
    });