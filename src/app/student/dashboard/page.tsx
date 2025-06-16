'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, TrendingUp, Award, Clock, Star, Flame } from 'lucide-react';
import { StudentNavigation } from '../../components/StudentNavigationBar';
import {
    PageTransition,
    StaggerContainer,
    FadeIn,
    SoftFadeIn,
    ScaleIn,
} from '../../components/page-transition';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const statsCards = [
        {
            title: '今日の学習',
            value: '25',
            unit: '単語',
            change: '+5 from yesterday',
            icon: BookOpen,
            color: 'blue',
        },
        {
            title: '正答率',
            value: '87%',
            change: '+5% from yesterday',
            icon: Target,
            color: 'green',
        },
        {
            title: '総学習単語',
            value: '1,247',
            unit: '累計',
            icon: TrendingUp,
            color: 'purple',
        },
        {
            title: '学習時間',
            value: '2.5h',
            unit: '今週',
            icon: Clock,
            color: 'red',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavigation />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6 p-6 mb-6">
                        {/* ウェルカムセクション */}
                        <FadeIn delay={0.1}>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <motion.h1
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            className="text-2xl font-bold mb-2"
                                        >
                                            おかえりなさい、田中さん！
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                            className="text-blue-100"
                                        >
                                            今日も英単語学習を頑張りましょう!
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                                        className="hidden sm:flex items-center space-x-2"
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatDelay: 3,
                                            }}
                                        >
                                            <Flame className="w-8 h-8 text-orange-300" />
                                        </motion.div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">7</p>
                                            <p className="text-sm text-blue-100">連続日数</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </FadeIn>

                        {/* 統計カード - 高さ統一 */}
                        <StaggerContainer>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {statsCards.map((stat, index) => {
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
                                                        {stat.unit && (
                                                            <p className="text-xs text-gray-500 mb-1">
                                                                {stat.unit}
                                                            </p>
                                                        )}
                                                        {stat.change && (
                                                            <p className="text-xs text-green-600">
                                                                {stat.change}
                                                            </p>
                                                        )}
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
                            {/* 今日の目標 - 高さ統一 */}
                            <SoftFadeIn delay={0.2}>
                                <Card className="hover:shadow-lg transition-shadow duration-300 h-80">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            <span>今日の目標</span>
                                        </CardTitle>
                                        <CardDescription>
                                            毎日の学習目標を達成しましょう
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 flex-1">
                                        {[
                                            {
                                                label: '新しい単語を学習',
                                                current: 25,
                                                total: 30,
                                                value: 83,
                                            },
                                            {
                                                label: '復習問題を解く',
                                                current: 8,
                                                total: 10,
                                                value: 80,
                                            },
                                            {
                                                label: '学習時間',
                                                current: 45,
                                                total: 60,
                                                value: 75,
                                                unit: '分',
                                            },
                                        ].map((goal, index) => (
                                            <motion.div
                                                key={goal.label}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + index * 0.1,
                                                    duration: 0.6,
                                                }}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">
                                                        {goal.label}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {goal.current}/{goal.total}
                                                        {goal.unit || ''}
                                                    </span>
                                                </div>
                                                <Progress value={goal.value} className="h-2" />
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>

                            {/* 最近の成果 - 高さ統一 */}
                            <SoftFadeIn delay={0.3}>
                                <Card className="hover:shadow-lg transition-shadow duration-300 h-80">
                                    <CardHeader className="pb-1">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Award className="w-5 h-5 text-yellow-600" />
                                            <span>最近の成果</span>
                                        </CardTitle>
                                        <CardDescription>
                                            頑張った成果を確認しましょう
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 flex-1">
                                        {[
                                            {
                                                icon: Star,
                                                text: '7日連続学習達成！',
                                                date: '2024年12月6日',
                                                color: 'yellow',
                                            },
                                            {
                                                icon: Target,
                                                text: '正答率90%達成',
                                                date: '2024年12月5日',
                                                color: 'green',
                                            },
                                            {
                                                icon: BookOpen,
                                                text: '1000単語学習完了',
                                                date: '2024年12月3日',
                                                color: 'blue',
                                            },
                                        ].map((achievement, index) => {
                                            const Icon = achievement.icon;
                                            return (
                                                <motion.div
                                                    key={achievement.text}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 0.5 + index * 0.1,
                                                        duration: 0.6,
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`flex items-center space-x-3 p-3 bg-${achievement.color}-50 rounded-lg cursor-pointer`}
                                                >
                                                    <Icon
                                                        className={`w-5 h-5 text-${achievement.color}-600`}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {achievement.text}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {achievement.date}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </SoftFadeIn>
                        </div>

                        {/* クイックアクション */}
                        <ScaleIn delay={0.4}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle>今すぐ学習を始める</CardTitle>
                                    <CardDescription>
                                        おすすめの学習コンテンツから選択してください
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { icon: BookOpen, label: '新しい単語', primary: true },
                                            { icon: Target, label: '復習クイズ', primary: false },
                                            { icon: TrendingUp, label: '弱点克服', primary: false },
                                        ].map((action, index) => {
                                            const Icon = action.icon;
                                            return (
                                                <motion.div
                                                    key={action.label}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay: 0.6 + index * 0.1,
                                                        duration: 0.6,
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        variant={
                                                            action.primary ? 'default' : 'outline'
                                                        }
                                                        className={`h-20 flex-col space-y-2 w-full ${
                                                            action.primary
                                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                                : ''
                                                        }`}
                                                    >
                                                        <Icon className="w-6 h-6" />
                                                        <span>{action.label}</span>
                                                    </Button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </ScaleIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
