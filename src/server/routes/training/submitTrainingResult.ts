/* トレーニング結果保存API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { studentWordStatus, studentStatistics } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

interface TrainingResult {
    wordId: string;
    word: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // ミリ秒
}

interface TrainingSubmission {
    studentId: string;
    level: number;
    mode: 'training' | 'review';
    results: TrainingResult[];
    totalTimeSpent: number;
}

export const submitTrainingResult = new Hono()
    .post('/submitTrainingResult', async (c) => {
        try {
            const submissionData: TrainingSubmission = await c.req.json();
            
            const { studentId, level, mode, results, totalTimeSpent } = submissionData;

            // バリデーション
            if (!studentId || !level || !results || !Array.isArray(results)) {
                return c.json({
                    flg: false,
                    message: '必要なデータが不足しています'
                }, 400);
            }

            if (results.length === 0) {
                return c.json({
                    flg: false,
                    message: '回答結果がありません'
                }, 400);
            }

            const correctAnswers = results.filter(r => r.isCorrect).length;
            const totalQuestions = results.length;
            const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) : 0;

            // 各単語の回答状況を記録
            for (const result of results) {
                // 既存の記録をチェック
                const existingRecord = await db
                    .select()
                    .from(studentWordStatus)
                    .where(
                        and(
                            eq(studentWordStatus.studentId, studentId),
                            eq(studentWordStatus.wordId, result.wordId)
                        )
                    )
                    .limit(1);

                if (existingRecord.length > 0) {
                    // 既存の記録を更新
                    await db
                        .update(studentWordStatus)
                        .set({
                            isCorrect: result.isCorrect,
                            answeredAt: new Date(),
                            answeredFlag: false, // 答えた後はfalseにリセット
                        })
                        .where(
                            and(
                                eq(studentWordStatus.studentId, studentId),
                                eq(studentWordStatus.wordId, result.wordId)
                            )
                        );
                } else {
                    // 新しい記録を作成
                    await db
                        .insert(studentWordStatus)
                        .values({
                            studentId,
                            wordId: result.wordId,
                            isCorrect: result.isCorrect,
                            answeredAt: new Date(),
                            answeredFlag: false, // 答えた後はfalseにリセット
                        });
                }
            }

            // 学習統計を更新
            const existingStats = await db
                .select()
                .from(studentStatistics)
                .where(eq(studentStatistics.studentId, studentId))
                .limit(1);

            const studyTimeMinutes = Math.round(totalTimeSpent / 60000); // ミリ秒を分に変換

            if (existingStats.length > 0) {
                const currentStats = existingStats[0];
                const newTotalStudyTime = (currentStats.totalStudyTime || 0) + studyTimeMinutes;
                const newWeeklyStudyTime = (currentStats.weeklyStudyTime || 0) + studyTimeMinutes;
                const newTodayWordsLearned = (currentStats.todayWordsLearned || 0) + totalQuestions;
                
                // 正答率の更新（移動平均的な計算）
                const newAccuracyRate = currentStats.accuracyRate 
                    ? (currentStats.accuracyRate * 0.8 + accuracyRate * 0.2)
                    : accuracyRate;

                await db
                    .update(studentStatistics)
                    .set({
                        totalStudyTime: newTotalStudyTime,
                        weeklyStudyTime: newWeeklyStudyTime,
                        accuracyRate: newAccuracyRate,
                        todayWordsLearned: newTodayWordsLearned,
                        updatedAt: new Date(),
                    })
                    .where(eq(studentStatistics.studentId, studentId));
            } else {
                // 新しい統計レコードを作成
                await db
                    .insert(studentStatistics)
                    .values({
                        studentId,
                        totalStudyTime: studyTimeMinutes,
                        weeklyStudyTime: studyTimeMinutes,
                        accuracyRate,
                        todayWordsLearned: totalQuestions,
                        consecutiveDays: 1,
                        updatedAt: new Date(),
                    });
            }

            return c.json({
                flg: true,
                message: '学習結果を保存しました',
                summary: {
                    totalQuestions,
                    correctAnswers,
                    accuracyRate: Math.round(accuracyRate * 100),
                    studyTimeMinutes,
                    level,
                    mode
                }
            }, 200);

        } catch (error) {
            console.error('学習結果保存エラー:', error);
            return c.json({
                flg: false,
                message: '学習結果の保存に失敗しました'
            }, 500);
        }
    });