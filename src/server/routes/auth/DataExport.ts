/* データエクスポートAPI */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { students, words, studentWordStatus, studentStatistics } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const dataExport = new Hono()
    // 生徒データエクスポート
    .post('/exportStudents', async (c) => {
        try {
            const { format } = await c.req.json();

            // 生徒データと統計データを結合して取得
            const studentsData = await db
                .select({
                    studentId: students.studentId,
                    name: students.name,
                    grade: students.grade,
                    registeredAt: students.registeredAt,
                    lastLoginAt: students.lastLoginAt,
                    totalStudyTime: studentStatistics.totalStudyTime,
                    weeklyStudyTime: studentStatistics.weeklyStudyTime,
                    accuracyRate: studentStatistics.accuracyRate,
                    todayWordsLearned: studentStatistics.todayWordsLearned,
                    consecutiveDays: studentStatistics.consecutiveDays,
                })
                .from(students)
                .leftJoin(studentStatistics, eq(students.studentId, studentStatistics.studentId));

            // データをフォーマット
            const formattedData = studentsData.map(student => ({
                '生徒ID': student.studentId,
                '名前': student.name,
                '学年': student.grade || '',
                '登録日': student.registeredAt ? new Date(student.registeredAt).toLocaleDateString('ja-JP') : '',
                '最終ログイン': student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleDateString('ja-JP') : '',
                '総学習時間（分）': student.totalStudyTime || 0,
                '今週の学習時間（分）': student.weeklyStudyTime || 0,
                '正答率（%）': student.accuracyRate ? Math.round(student.accuracyRate * 100) : 0,
                '今日覚えた単語数': student.todayWordsLearned || 0,
                '連続学習日数': student.consecutiveDays || 0,
            }));

            if (format === 'csv') {
                // CSV形式での出力
                const headers = Object.keys(formattedData[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...formattedData.map(row => 
                        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
                    )
                ].join('\n');

                return new Response(csvContent, {
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="students_${new Date().toISOString().split('T')[0]}.csv"`,
                    },
                });
            } else {
                // JSON形式での出力（Excel向け）
                return c.json({
                    flg: true,
                    data: formattedData,
                    filename: `students_${new Date().toISOString().split('T')[0]}.json`
                });
            }

        } catch (error) {
            console.error('生徒データエクスポートエラー:', error);
            return c.json({
                flg: false,
                message: '生徒データのエクスポートに失敗しました'
            }, 500);
        }
    })

    // 単語データエクスポート
    .post('/exportWords', async (c) => {
        try {
            const { format } = await c.req.json();

            // 単語データを取得
            const wordsData = await db
                .select({
                    id: words.id,
                    word: words.word,
                    meaning: words.meaning,
                    level: words.level,
                    addedAt: words.addedAt,
                })
                .from(words)
                .orderBy(words.addedAt);

            // 各単語の正答率を計算
            const formattedData = await Promise.all(
                wordsData.map(async (word) => {
                    const wordStats = await db
                        .select({
                            totalAnswers: studentWordStatus.id,
                            isCorrect: studentWordStatus.isCorrect,
                        })
                        .from(studentWordStatus)
                        .where(eq(studentWordStatus.wordId, word.id));

                    const totalAnswers = wordStats.length;
                    const correctAnswers = wordStats.filter(stat => stat.isCorrect).length;
                    const accuracyRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

                    return {
                        'ID': word.id,
                        '単語': word.word,
                        '意味': word.meaning || '',
                        'レベル': word.level || '',
                        '追加日': word.addedAt ? new Date(word.addedAt).toLocaleDateString('ja-JP') : '',
                        '回答回数': totalAnswers,
                        '正答回数': correctAnswers,
                        '正答率（%）': accuracyRate,
                    };
                })
            );

            if (format === 'csv') {
                // CSV形式での出力
                const headers = Object.keys(formattedData[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...formattedData.map(row => 
                        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
                    )
                ].join('\n');

                return new Response(csvContent, {
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="words_${new Date().toISOString().split('T')[0]}.csv"`,
                    },
                });
            } else {
                // JSON形式での出力（Excel向け）
                return c.json({
                    flg: true,
                    data: formattedData,
                    filename: `words_${new Date().toISOString().split('T')[0]}.json`
                });
            }

        } catch (error) {
            console.error('単語データエクスポートエラー:', error);
            return c.json({
                flg: false,
                message: '単語データのエクスポートに失敗しました'
            }, 500);
        }
    })

    // 学習統計データエクスポート
    .post('/exportStatistics', async (c) => {
        try {
            const { format } = await c.req.json();

            // 学習統計データを生徒名と結合して取得
            const statsData = await db
                .select({
                    studentId: students.studentId,
                    studentName: students.name,
                    grade: students.grade,
                    totalStudyTime: studentStatistics.totalStudyTime,
                    weeklyStudyTime: studentStatistics.weeklyStudyTime,
                    accuracyRate: studentStatistics.accuracyRate,
                    todayWordsLearned: studentStatistics.todayWordsLearned,
                    consecutiveDays: studentStatistics.consecutiveDays,
                    updatedAt: studentStatistics.updatedAt,
                })
                .from(studentStatistics)
                .leftJoin(students, eq(studentStatistics.studentId, students.studentId));

            // データをフォーマット
            const formattedData = statsData.map(stat => ({
                '生徒ID': stat.studentId,
                '生徒名': stat.studentName || '',
                '学年': stat.grade || '',
                '総学習時間（分）': stat.totalStudyTime || 0,
                '今週の学習時間（分）': stat.weeklyStudyTime || 0,
                '正答率（%）': stat.accuracyRate ? Math.round(stat.accuracyRate * 100) : 0,
                '今日覚えた単語数': stat.todayWordsLearned || 0,
                '連続学習日数': stat.consecutiveDays || 0,
                '最終更新': stat.updatedAt ? new Date(stat.updatedAt).toLocaleDateString('ja-JP') : '',
            }));

            if (format === 'csv') {
                // CSV形式での出力
                const headers = Object.keys(formattedData[0] || {});
                const csvContent = [
                    headers.join(','),
                    ...formattedData.map(row => 
                        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
                    )
                ].join('\n');

                return new Response(csvContent, {
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8',
                        'Content-Disposition': `attachment; filename="statistics_${new Date().toISOString().split('T')[0]}.csv"`,
                    },
                });
            } else {
                // JSON形式での出力（Excel向け）
                return c.json({
                    flg: true,
                    data: formattedData,
                    filename: `statistics_${new Date().toISOString().split('T')[0]}.json`
                });
            }

        } catch (error) {
            console.error('学習統計データエクスポートエラー:', error);
            return c.json({
                flg: false,
                message: '学習統計データのエクスポートに失敗しました'
            }, 500);
        }
    });