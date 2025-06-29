/* ローディング時のロードページ */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';

type FloatingWord = {
    word: string;
    initialX: number;
    targetX: number;
};

export default function Loading() {
    const [screenWidth, setScreenWidth] = useState(768);
    const [floatingWords, setFloatingWords] = useState<FloatingWord[] | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            setScreenWidth(width);

            const words = ['Hello', 'Study', 'Learn', 'Success', 'English'].map((word) => ({
                word,
                initialX: Math.random() * width,
                targetX: Math.random() * (width - 100),
            }));
            setFloatingWords(words);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
                {/* メインローディングアニメーション */}
                <motion.div
                    className="relative mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                            },
                            scale: {
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <BookOpen className="w-10 h-10 text-white" />
                    </motion.div>

                    <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{
                            rotate: -360,
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                            },
                            scale: {
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                    </motion.div>

                    <motion.div
                        className="absolute -bottom-2 -left-2"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            rotate: {
                                duration: 2.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                            },
                            scale: {
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                            },
                        }}
                    >
                        <GraduationCap className="w-6 h-6 text-green-500" />
                    </motion.div>
                </motion.div>

                {/* テキストアニメーション */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">English Vocabulary</h2>
                    <motion.p
                        className="text-gray-600"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        }}
                    >
                        読み込み中...
                    </motion.p>
                </motion.div>

                {/* プログレスバー */}
                <motion.div
                    className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 256 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                            repeatType: 'reverse',
                        }}
                    />
                </motion.div>
            </div>

            {/* 浮遊する単語カード（ランダム位置 → useEffectでのみ描画） */}
            {floatingWords && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {floatingWords.map(({ word, initialX, targetX }, index) => (
                        <motion.div
                            key={word}
                            className="absolute bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-sm"
                            initial={{ opacity: 0, x: initialX, y: 800 }}
                            animate={{ opacity: [0, 1, 0], y: -50, x: targetX }}
                            transition={{
                                duration: 4 + index,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: index * 0.8,
                                ease: 'linear',
                            }}
                        >
                            {word}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
