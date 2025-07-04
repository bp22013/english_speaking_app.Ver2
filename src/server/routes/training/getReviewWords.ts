/* 復習用単語取得API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { words, studentWordStatus } from '@/server/db/schema';
import { eq, and, isNull, or } from 'drizzle-orm';

export const getReviewWords = new Hono()
    .get('/getReviewWords', async (c) => {
        try {
            const studentId = c.req.query('studentId');
            const level = c.req.query('level');

            if (!studentId) {
                return c.json({
                    flg: false,
                    message: '生徒IDが指定されていません'
                }, 400);
            }

            let query = db
                .select({
                    id: words.id,
                    word: words.word,
                    meaning: words.meaning,
                    level: words.level,
                })
                .from(words)
                .leftJoin(
                    studentWordStatus,
                    and(
                        eq(studentWordStatus.wordId, words.id),
                        eq(studentWordStatus.studentId, studentId)
                    )
                );

            // レベル指定がある場合はフィルタリング
            if (level) {
                const levelNum = parseInt(level);
                if (levelNum >= 1 && levelNum <= 10) {
                    query = query.where(
                        and(
                            eq(words.level, levelNum),
                            // 間違えた単語または未回答の単語を取得
                            or(
                                eq(studentWordStatus.isCorrect, false),
                                isNull(studentWordStatus.isCorrect)
                            )
                        )
                    );
                }
            } else {
                // レベル指定がない場合は全レベルの間違えた単語を取得
                query = query.where(
                    or(
                        eq(studentWordStatus.isCorrect, false),
                        isNull(studentWordStatus.isCorrect)
                    )
                );
            }

            const reviewWords = await query.limit(20);

            if (reviewWords.length === 0) {
                return c.json({
                    flg: false,
                    message: level ? `レベル${level}の復習対象の単語が見つかりません` : '復習対象の単語が見つかりません'
                }, 404);
            }

            // ランダムにシャッフル
            const shuffledWords = reviewWords.sort(() => Math.random() - 0.5);

            return c.json({
                flg: true,
                data: shuffledWords.map(word => ({
                    id: word.id,
                    word: word.word,
                    answer: word.meaning,
                    level: word.level,
                    hint: `レベル${word.level}の復習問題`
                })),
                level: level ? parseInt(level) : null,
                mode: 'review',
                totalWords: shuffledWords.length,
                message: '復習用の単語を取得しました'
            }, 200);

        } catch (error) {
            console.error('復習単語取得エラー:', error);
            return c.json({
                flg: false,
                message: '復習用単語の取得に失敗しました'
            }, 500);
        }
    });