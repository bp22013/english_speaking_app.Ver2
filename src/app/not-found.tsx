'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, BookOpen, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    // ランダムなドットの位置を useEffect で生成
    const [dots, setDots] = useState<{ left: string; top: string }[]>([]);

    useEffect(() => {
        const randomDots = Array.from({ length: 6 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
        }));
        setDots(randomDots);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <motion.div
                className="max-w-2xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 404 イラスト */}
                <motion.div className="relative mb-8" variants={itemVariants}>
                    <motion.div
                        className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 1, -1, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        }}
                    >
                        404
                    </motion.div>

                    <motion.div
                        className="absolute top-0 left-1/4"
                        animate={{
                            y: [-10, 10, -10],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        }}
                    >
                        <BookOpen className="w-12 h-12 text-blue-400 opacity-60" />
                    </motion.div>

                    <motion.div
                        className="absolute top-4 right-1/4"
                        animate={{
                            y: [10, -10, 10],
                            rotate: [0, -5, 5, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                            delay: 0.5,
                        }}
                    >
                        <HelpCircle className="w-8 h-8 text-purple-400 opacity-60" />
                    </motion.div>
                </motion.div>

                {/* メッセージ */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        ページが見つかりません
                    </h1>
                    <p className="text-gray-600 text-lg mb-2">
                        お探しのページは存在しないか、移動された可能性があります。
                    </p>
                    <p className="text-gray-500">
                        URLを確認するか、以下のオプションをお試しください。
                    </p>
                </motion.div>

                {/* アクションカード */}
                <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
                    <Card className="w-full md:w-1/2 hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                                <Home className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">ホームに戻る</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                トップページから目的のページを探してください
                            </p>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                onClick={() =>
                                    router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/`)
                                }
                            >
                                ホームページへ
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 装飾的なランダムドット */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {dots.map((dot, index) => (
                        <motion.div
                            key={index}
                            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
                            style={dot}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2 + index * 0.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                                delay: index * 0.3,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
