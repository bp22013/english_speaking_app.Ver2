'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    BarChart,
    Users,
    BookOpen,
    Mail,
    AlertCircle,
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    Plus,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import {
    PageTransition,
    FadeIn,
    SoftFadeIn,
    StaggerContainer,
} from '../../components/page-transition';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
    // サンプルデータ
    const recentStudents = [
        { id: 1, name: '田中太郎', grade: '高校2年生', lastActive: '10分前', progress: 78 },
        { id: 2, name: '佐藤花子', grade: '高校1年生', lastActive: '2時間前', progress: 92 },
        { id: 3, name: '鈴木一郎', grade: '中学3年生', lastActive: '昨日', progress: 45 },
    ];

    const recentVocabulary = [
        { id: 1, word: 'apple', meaning: 'りんご', category: '果物', addedAt: '2024年1月15日' },
        {
            id: 2,
            word: 'computer',
            meaning: 'コンピューター',
            category: 'テクノロジー',
            addedAt: '2024年1月14日',
        },
        { id: 3, word: 'book', meaning: '本', category: '文房具', addedAt: '2024年1月12日' },
    ];

    const stats = [
        { title: '登録生徒数', value: '156', icon: Users, color: 'blue', change: '+12% 先月比' },
        { title: '単語数', value: '2,450', icon: BookOpen, color: 'green', change: '+85 今週' },
        { title: '未読メッセージ', value: '8', icon: Mail, color: 'yellow', change: '3件 緊急' },
        { title: '問題報告', value: '2', icon: AlertCircle, color: 'red', change: '対応待ち' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation currentPage="dashboard" />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="text-3xl font-bold text-gray-900 mb-2"
                                    >
                                        管理者ダッシュボード
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-gray-600"
                                    >
                                        システム全体の概要と最近のアクティビティ
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mt-4 md:mt-0 flex space-x-3"
                                >
                                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                                        <Link href="/admin/vocabulary">
                                            <Plus className="mr-2 h-4 w-4" />
                                            単語を追加
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/admin/student">
                                            <Users className="mr-2 h-4 w-4" />
                                            生徒一覧
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* 統計カード */}
                        <StaggerContainer>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={stat.title}
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: { opacity: 1 },
                                            }}
                                            whileHover={{
                                                scale: 1.03,
                                                transition: { type: 'spring', stiffness: 300 },
                                            }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow duration-300 h-32">
                                                <CardContent className="p-6 h-full flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            {stat.title}
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                                            {stat.value}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {stat.change}
                                                        </p>
                                                    </div>
                                                    <motion.div
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{
                                                            duration: 0.6,
                                                            ease: 'easeInOut',
                                                        }}
                                                        className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
                                                    >
                                                        <Icon
                                                            className={`w-6 h-6 text-${stat.color}-600`}
                                                        />
                                                    </motion.div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </StaggerContainer>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 最近のアクティビティ */}
                            <SoftFadeIn delay={0.2}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center space-x-2">
                                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                                <span>最近のアクティビティ</span>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm">
                                                すべて表示
                                            </Button>
                                        </div>
                                        <CardDescription>
                                            システム全体の最近のアクティビティ
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            {
                                                icon: Users,
                                                text: '新しい生徒「山本健太」が登録されました',
                                                time: '30分前',
                                                color: 'blue',
                                            },
                                            {
                                                icon: BookOpen,
                                                text: '15個の新しい単語が追加されました',
                                                time: '2時間前',
                                                color: 'green',
                                            },
                                            {
                                                icon: CheckCircle2,
                                                text: '「高校1年生」グループの週次テストが完了しました',
                                                time: '昨日',
                                                color: 'green',
                                            },
                                            {
                                                icon: XCircle,
                                                text: '「中学3年生」グループの3名が課題を未提出です',
                                                time: '2日前',
                                                color: 'red',
                                            },
                                            {
                                                icon: Mail,
                                                text: '全生徒に新機能のお知らせを送信しました',
                                                time: '3日前',
                                                color: 'yellow',
                                            },
                                        ].map((activity, index) => {
                                            const Icon = activity.icon;
                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 0.4 + index * 0.1,
                                                        duration: 0.6,
                                                    }}
                                                    className="flex items-start space-x-3"
                                                >
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color}-100 mt-0.5`}
                                                    >
                                                        <Icon
                                                            className={`w-4 h-4 text-${activity.color}-600`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {activity.text}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {activity.time}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>

                            {/* カレンダー */}
                            <SoftFadeIn delay={0.3}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center space-x-2">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                                <span>今後の予定</span>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm">
                                                すべて表示
                                            </Button>
                                        </div>
                                        <CardDescription>今後の予定とタスク</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            {
                                                title: '高校2年生 単語テスト',
                                                date: '2024年1月30日',
                                                time: '10:00 - 11:30',
                                                status: 'upcoming',
                                            },
                                            {
                                                title: '新教材レビュー会議',
                                                date: '2024年2月2日',
                                                time: '13:00 - 14:00',
                                                status: 'upcoming',
                                            },
                                            {
                                                title: 'システムメンテナンス',
                                                date: '2024年2月5日',
                                                time: '22:00 - 23:00',
                                                status: 'maintenance',
                                            },
                                            {
                                                title: '中間テスト結果分析',
                                                date: '2024年2月10日',
                                                time: '終日',
                                                status: 'important',
                                            },
                                        ].map((event, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + index * 0.1,
                                                    duration: 0.6,
                                                }}
                                                whileHover={{ scale: 1.01 }}
                                                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <div className="w-10 text-center">
                                                    <p className="text-sm font-bold text-purple-600">
                                                        {event.date.split('月')[1].split('日')[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {event.date.split('年')[1].split('日')[0]}月
                                                    </p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-gray-900">
                                                            {event.title}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                event.status === 'important'
                                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                                    : event.status === 'maintenance'
                                                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                                            }
                                                        >
                                                            {event.status === 'important'
                                                                ? '重要'
                                                                : event.status === 'maintenance'
                                                                ? 'メンテナンス'
                                                                : '予定'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 最近の生徒 */}
                            <SoftFadeIn delay={0.4}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-purple-600" />
                                                <span>最近のアクティブな生徒</span>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="/admin/students">すべて表示</Link>
                                            </Button>
                                        </div>
                                        <CardDescription>
                                            最近アクティブだった生徒の一覧
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentStudents.map((student, index) => (
                                                <motion.div
                                                    key={student.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 0.5 + index * 0.1,
                                                        duration: 0.6,
                                                    }}
                                                    whileHover={{ scale: 1.01 }}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <span className="font-medium text-purple-600">
                                                                {student.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {student.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {student.grade} •{' '}
                                                                {student.lastActive}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-32">
                                                            <p className="text-xs text-gray-500 mb-1">
                                                                学習進捗
                                                            </p>
                                                            <Progress
                                                                value={student.progress}
                                                                className="h-2"
                                                            />
                                                        </div>
                                                        <p className="text-sm font-medium">
                                                            {student.progress}%
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>

                            {/* 最近の単語 */}
                            <SoftFadeIn delay={0.5}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center space-x-2">
                                                <BookOpen className="w-5 h-5 text-purple-600" />
                                                <span>最近追加された単語</span>
                                            </CardTitle>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href="/admin/vocabulary">すべて表示</Link>
                                            </Button>
                                        </div>
                                        <CardDescription>
                                            最近システムに追加された単語
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentVocabulary.map((vocab, index) => (
                                                <motion.div
                                                    key={vocab.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 0.6 + index * 0.1,
                                                        duration: 0.6,
                                                    }}
                                                    whileHover={{ scale: 1.01 }}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                                                >
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="font-medium text-gray-900">
                                                                {vocab.word}
                                                            </p>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-green-50 text-green-700 border-green-100"
                                                            >
                                                                {vocab.category}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {vocab.meaning}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            {vocab.addedAt}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>
                        </div>

                        {/* システム概要 */}
                        <FadeIn delay={0.6}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart className="w-5 h-5 text-purple-600" />
                                        <span>システム概要</span>
                                    </CardTitle>
                                    <CardDescription>システム全体の統計情報</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            {
                                                label: '総生徒数',
                                                value: '156',
                                                change: '+12% 先月比',
                                            },
                                            {
                                                label: '総単語数',
                                                value: '2,450',
                                                change: '+85 今週',
                                            },
                                            {
                                                label: '平均学習時間',
                                                value: '45分/日',
                                                change: '+5分 先週比',
                                            },
                                            {
                                                label: '平均正答率',
                                                value: '76%',
                                                change: '+2% 先月比',
                                            },
                                        ].map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.7 + index * 0.1,
                                                    duration: 0.6,
                                                }}
                                                className="text-center p-4 bg-gray-50 rounded-lg"
                                            >
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {stat.value}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {stat.label}
                                                </p>
                                                <p className="text-xs text-green-600 mt-1">
                                                    {stat.change}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
