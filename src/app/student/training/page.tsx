'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Clock, Star, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { StudentNavigation } from '../../components/StudentNavigationBar';
import {
    PageTransition,
    StaggerContainer,
    FadeIn,
    SoftFadeIn,
} from '../../components/page-transition';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import Loading from '@/app/loading';

const recentSessions = [
    {
        mode: '単語学習',
        date: '2024年1月26日',
        words: 20,
        score: 85,
    },
    {
        mode: 'リスニング',
        date: '2024年1月25日',
        words: 15,
        score: 92,
    },
];

export default function TrainingPage() {
    const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
    const [selectedReviewLevel, setSelectedReviewLevel] = useState<number | null>(null);
    const { loading } = useAuth();
    const router = useRouter();

    const TransitionQuestionPage = () => {
        if (selectedLevel) {
            router.push(`/student/question/?level=${selectedLevel}`);
        } else {
            toast.error('レベルを選択してください');
        }
    };

    const TransitionReviewPage = () => {
        if (selectedReviewLevel) {
            router.push(`/student/review/?level=${selectedReviewLevel}`);
        } else {
            toast.error('レベルを選択してください');
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavigation />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6 p-6 mb-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="text-center">
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                >
                                    トレーニング
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-gray-600"
                                >
                                    様々な学習モードで英単語をマスターしましょう
                                </motion.p>
                            </div>
                        </FadeIn>

                        {/* トレーニングカード */}
                        <StaggerContainer>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 単語トレーニング */}
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300 min-h-[240px] flex flex-col justify-between">
                                        <CardHeader>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        単語トレーニング
                                                    </CardTitle>
                                                    <CardDescription>
                                                        レベル別に単語をトレーニングできます
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-4">
                                            <div className="grid grid-cols-5 gap-2">
                                                {[...Array(10)].map((_, i) => (
                                                    <Button
                                                        key={i + 1}
                                                        variant={
                                                            selectedLevel === i + 1
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() => setSelectedLevel(i + 1)}
                                                        className="cursor-pointer"
                                                    >
                                                        Lv{i + 1}
                                                    </Button>
                                                ))}
                                            </div>
                                            {/* 常にスペース確保 */}
                                            <div className="text-right min-h-[2.5rem]">
                                                <AnimatePresence>
                                                    {selectedLevel && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Button
                                                                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                                                onClick={TransitionQuestionPage}
                                                            >
                                                                <Play className="w-4 h-4 mr-2" />
                                                                Lv{selectedLevel} を開始
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* 復習 */}
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300 min-h-[240px] flex flex-col justify-between">
                                        <CardHeader>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <RotateCcw className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">復習</CardTitle>
                                                    <CardDescription>
                                                        間違えた単語を中心に復習しましょう
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-4">
                                            <div className="grid grid-cols-5 gap-2">
                                                {[...Array(10)].map((_, i) => (
                                                    <Button
                                                        key={i + 1}
                                                        variant={
                                                            selectedReviewLevel === i + 1
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() =>
                                                            setSelectedReviewLevel(i + 1)
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        Lv{i + 1}
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="text-right min-h-[2.5rem]">
                                                <AnimatePresence>
                                                    {selectedReviewLevel && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Button
                                                                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                                onClick={TransitionReviewPage}
                                                            >
                                                                <Play className="w-4 h-4 mr-2" />
                                                                Lv{selectedReviewLevel} を開始
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </StaggerContainer>

                        {/* 学習統計 */}
                        <SoftFadeIn delay={0.2}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    {
                                        icon: Target,
                                        value: '87%',
                                        label: '平均正答率',
                                        color: 'blue',
                                    },
                                    {
                                        icon: Star,
                                        value: '1,247',
                                        label: '学習済み単語',
                                        color: 'green',
                                    },
                                    {
                                        icon: Clock,
                                        value: '24h',
                                        label: '総学習時間',
                                        color: 'purple',
                                    },
                                ].map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                                                <CardContent className="p-6 text-center">
                                                    <div
                                                        className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}
                                                    >
                                                        <Icon
                                                            className={`w-6 h-6 text-${stat.color}-600`}
                                                        />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {stat.value}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {stat.label}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </SoftFadeIn>

                        {/* 最近のセッション */}
                        <FadeIn delay={0.3}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>最近の学習履歴</CardTitle>
                                    <CardDescription>
                                        過去の学習セッションの結果を確認できます
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentSessions.map((session, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + index * 0.1,
                                                    duration: 0.6,
                                                }}
                                                whileHover={{ scale: 1.01 }}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {session.mode}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {session.date} • {session.words}単語
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {session.score}%
                                                    </p>
                                                    <Button variant="ghost" size="sm">
                                                        <RotateCcw className="w-4 h-4 mr-1" />
                                                        再挑戦
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>

                        {/* 推奨学習 */}
                        <FadeIn delay={0.4}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>今日の推奨学習</CardTitle>
                                    <CardDescription>
                                        あなたの学習状況に基づいたおすすめです
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">
                                                    弱点克服セッション
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    過去の間違いから15単語をピックアップしました
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>約10分</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Target className="w-4 h-4" />
                                                        <span>15単語</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="bg-blue-600 hover:bg-blue-700">
                                                開始する
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
