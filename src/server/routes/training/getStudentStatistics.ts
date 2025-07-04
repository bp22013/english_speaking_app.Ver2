/* 生徒学習統計取得API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { studentStatistics, studentWordStatus, words } from '@/server/db/schema';
import { eq, count, and, avg } from 'drizzle-orm';

export const getStudentStatistics = new Hono()
    .get('/getStudentStatistics', async (c) => {
        try {
            const studentId = c.req.query('studentId');

            if (!studentId) {
                return c.json({
                    flg: false,
                    message: '生徒IDが指定されていません'
                }, 400);
            }

            // 基本統計情報を取得
            const basicStats = await db
                .select()
                .from(studentStatistics)
                .where(eq(studentStatistics.studentId, studentId))
                .limit(1);

            // 総学習単語数を取得
            const totalWordsLearned = await db
                .select({ count: count() })
                .from(studentWordStatus)
                .where(
                    and(
                        eq(studentWordStatus.studentId, studentId),
                        eq(studentWordStatus.answeredFlag, true)
                    )
                );

            // 正解した単語数を取得
            const correctWordsCount = await db
                .select({ count: count() })
                .from(studentWordStatus)
                .where(
                    and(
                        eq(studentWordStatus.studentId, studentId),
                        eq(studentWordStatus.isCorrect, true)
                    )
                );

            // 間違えた単語数を取得
            const incorrectWordsCount = await db
                .select({ count: count() })
                .from(studentWordStatus)
                .where(
                    and(
                        eq(studentWordStatus.studentId, studentId),
                        eq(studentWordStatus.isCorrect, false)
                    )
                );

            // レベル別の進捗を取得
            const levelProgress = await db
                .select({
                    level: words.level,
                    totalWords: count(),
                    answeredWords: count(studentWordStatus.wordId),
                    correctWords: count(
                        and(
                            studentWordStatus.isCorrect, 
                            eq(studentWordStatus.isCorrect, true)
                        )
                    )
                })
                .from(words)
                .leftJoin(
                    studentWordStatus,
                    and(
                        eq(studentWordStatus.wordId, words.id),
                        eq(studentWordStatus.studentId, studentId)
                    )
                )
                .groupBy(words.level)
                .orderBy(words.level);

            const stats = basicStats[0] || {
                totalStudyTime: 0,
                weeklyStudyTime: 0,
                accuracyRate: 0,
                todayWordsLearned: 0,
                consecutiveDays: 0
            };

            return c.json({
                flg: true,
                data: {
                    // 基本統計
                    totalStudyTime: stats.totalStudyTime || 0,
                    weeklyStudyTime: stats.weeklyStudyTime || 0,
                    accuracyRate: Math.round((stats.accuracyRate || 0) * 100),
                    todayWordsLearned: stats.todayWordsLearned || 0,
                    consecutiveDays: stats.consecutiveDays || 0,
                    
                    // 学習単語統計
                    totalWordsLearned: totalWordsLearned[0]?.count || 0,
                    correctWords: correctWordsCount[0]?.count || 0,
                    incorrectWords: incorrectWordsCount[0]?.count || 0,
                    
                    // レベル別進捗
                    levelProgress: levelProgress.map(level => ({
                        level: level.level,
                        totalWords: level.totalWords,
                        answeredWords: level.answeredWords || 0,
                        correctWords: level.correctWords || 0,
                        progress: level.totalWords > 0 
                            ? Math.round(((level.answeredWords || 0) / level.totalWords) * 100)
                            : 0,
                        accuracy: (level.answeredWords || 0) > 0
                            ? Math.round(((level.correctWords || 0) / (level.answeredWords || 1)) * 100)
                            : 0
                    }))
                }
            }, 200);

        } catch (error) {
            console.error('学習統計取得エラー:', error);
            return c.json({
                flg: false,
                message: '学習統計の取得に失敗しました'
            }, 500);
        }
    });