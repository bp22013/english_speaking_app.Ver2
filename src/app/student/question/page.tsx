'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuizHeader } from '../../components/quiz-header';
import { useRouter } from 'next/navigation';
import {
    PageTransition,
    FadeIn,
    SoftFadeIn,
    StaggerContainer,
} from '../../components/page-transition';
import {
    Check,
    X,
    ArrowRight,
    Loader2,
    RotateCcw,
    Home,
    Award,
    Clock,
    BookOpen,
    BarChart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { handleCanon } from '@/app/components/particle/happyCanon';
import { useSession } from '@/app/hook/useSession';
import Loading from '@/app/loading';

// 問題データの型定義
interface QuizItem {
    id: number;
    word: string;
    answer: string;
    hint?: string;
}

// ユーザーの回答記録の型定義
interface UserAnswer {
    quizId: number;
    word: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number; // ミリ秒
}

// サンプル問題データ
const sampleQuizItems: QuizItem[] = [
    { id: 1, word: 'apple', answer: 'りんご', hint: '赤い果物' },
    { id: 2, word: 'book', answer: '本', hint: '読むもの' },
    { id: 3, word: 'computer', answer: 'コンピューター', hint: '電子機器' },
    { id: 4, word: 'window', answer: '窓', hint: '外を見るもの' },
    { id: 5, word: 'chair', answer: '椅子', hint: '座るもの' },
];

export default function QuizPage() {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
    const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentQuiz = sampleQuizItems[currentQuizIndex];
    const { isAuthenticated, loading } = useSession();
    const router = useRouter();

    // 問題が変わったらフォームをリセット
    useEffect(() => {
        setUserAnswer('');
        setIsSubmitted(false);
        setIsCorrect(false);
        setShowHint(false);
        setQuestionStartTime(Date.now());
        // 入力フィールドにフォーカス
        if (inputRef.current) {
            inputRef.current.focus();
        }

        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [currentQuizIndex, loading, isAuthenticated, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            const timeSpent = Date.now() - questionStartTime;
            const isAnswerCorrect = userAnswer === currentQuiz.answer;

            // 回答を記録
            const newAnswer: UserAnswer = {
                quizId: currentQuiz.id,
                word: currentQuiz.word,
                correctAnswer: currentQuiz.answer,
                userAnswer: userAnswer,
                isCorrect: isAnswerCorrect,
                timeSpent: timeSpent,
            };

            setUserAnswers((prev) => [...prev, newAnswer]);
            setIsSubmitted(true);
            setIsCorrect(isAnswerCorrect);
            setIsLoading(false);

            if (isAnswerCorrect) {
                handleCanon();
            }
        }, 500); // フェイク送信遅延
    };

    const handleNextQuestion = () => {
        if (currentQuizIndex < sampleQuizItems.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
            // 全問題終了時の処理
            const endTime = Date.now();
            setTotalTimeSpent(endTime - startTime);
            setQuizCompleted(true);
        }
    };

    const handleRetryQuiz = () => {
        setCurrentQuizIndex(0);
        setUserAnswers([]);
        setQuizCompleted(false);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
    };

    const toggleHint = () => {
        setShowHint(!showHint);
    };

    const progress = ((currentQuizIndex + 1) / sampleQuizItems.length) * 100;

    // 結果の集計
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = userAnswers.length - correctAnswers;
    const scorePercentage =
        userAnswers.length > 0 ? (correctAnswers / userAnswers.length) * 100 : 0;
    const averageTimePerQuestion =
        userAnswers.length > 0 ? Math.round(totalTimeSpent / 1000) / userAnswers.length : 0;

    // スコアに基づくフィードバックメッセージ
    const getFeedbackMessage = () => {
        if (scorePercentage >= 90) return '素晴らしい！完璧に近い成績です！';
        if (scorePercentage >= 70) return 'よくできました！さらなる向上を目指しましょう。';
        if (scorePercentage >= 50) return '頑張りました。復習して再挑戦しましょう。';
        return '基礎からしっかり復習しましょう。';
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <QuizHeader title={quizCompleted ? '学習結果' : '単語問題'} />
            <PageTransition>
                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {!quizCompleted ? (
                        <div className="space-y-6">
                            {/* 進捗バー */}
                            <FadeIn delay={0.1}>
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>
                                            問題 {currentQuizIndex + 1} / {sampleQuizItems.length}
                                        </span>
                                        <span>進捗 {Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <motion.div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            initial={{
                                                width: `${
                                                    (currentQuizIndex / sampleQuizItems.length) *
                                                    100
                                                }%`,
                                            }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </FadeIn>

                            {/* 問題カード */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuiz.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Card className="border-2 border-blue-100 shadow-lg">
                                        <CardHeader className="pb-4 text-center">
                                            <CardTitle className="text-lg text-gray-600">
                                                次の単語の意味を答えてください
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-center pb-6">
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                                className="mb-8"
                                            >
                                                <h2 className="text-4xl font-bold text-blue-700 mb-2">
                                                    {currentQuiz.word}
                                                </h2>
                                                {showHint && currentQuiz.hint && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-sm text-gray-500 italic"
                                                    >
                                                        ヒント: {currentQuiz.hint}
                                                    </motion.p>
                                                )}
                                            </motion.div>

                                            {!isSubmitted ? (
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div className="flex flex-col items-center">
                                                        <Input
                                                            ref={inputRef}
                                                            type="text"
                                                            value={userAnswer}
                                                            onChange={(e) =>
                                                                setUserAnswer(e.target.value)
                                                            }
                                                            placeholder="日本語で入力してください"
                                                            className="max-w-xs text-center text-lg"
                                                            disabled={isLoading}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex justify-center space-x-3">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={toggleHint}
                                                            className="cursor-pointer"
                                                            disabled={
                                                                isLoading || !currentQuiz.hint
                                                            }
                                                        >
                                                            {showHint
                                                                ? 'ヒントを隠す'
                                                                : 'ヒントを見る'}
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                !userAnswer.trim() || isLoading
                                                            }
                                                            className={`min-w-[120px] cursor-pointer text-white transition-colors duration-200 ${
                                                                !userAnswer.trim() || isLoading
                                                                    ? 'bg-white text-gray-400 border border-gray-300'
                                                                    : 'bg-green-500 hover:bg-green-600'
                                                            }`}
                                                        >
                                                            {isLoading ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    送信中...
                                                                </>
                                                            ) : (
                                                                '解答する'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <SoftFadeIn>
                                                    <div className="space-y-6">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div
                                                                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                                                    isCorrect
                                                                        ? 'bg-green-100'
                                                                        : 'bg-red-100'
                                                                }`}
                                                            >
                                                                {isCorrect ? (
                                                                    <Check className="h-8 w-8 text-green-600" />
                                                                ) : (
                                                                    <X className="h-8 w-8 text-red-600" />
                                                                )}
                                                            </div>
                                                            <h3
                                                                className={`text-xl font-semibold ${
                                                                    isCorrect
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}
                                                            >
                                                                {isCorrect
                                                                    ? '正解です！'
                                                                    : '不正解です'}
                                                            </h3>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                                            <div>
                                                                <p className="text-sm text-gray-600">
                                                                    あなたの回答:
                                                                </p>
                                                                <p className="text-lg font-medium">
                                                                    {userAnswer}
                                                                </p>
                                                            </div>
                                                            {!isCorrect && (
                                                                <div>
                                                                    <p className="text-sm text-gray-600">
                                                                        正解:
                                                                    </p>
                                                                    <p className="text-lg font-medium text-green-600">
                                                                        {currentQuiz.answer}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <Button
                                                            onClick={handleNextQuestion}
                                                            className="w-full bg-blue-500 cursor-pointer"
                                                        >
                                                            {currentQuizIndex <
                                                            sampleQuizItems.length - 1 ? (
                                                                <>
                                                                    次の問題へ
                                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    結果を見る
                                                                    <BarChart className="ml-2 h-4 w-4" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </SoftFadeIn>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    ) : (
                        // 結果画面
                        <div className="space-y-6">
                            <FadeIn delay={0.1}>
                                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-center"
                                        >
                                            <h2 className="text-2xl font-bold mb-2">学習完了！</h2>
                                            <p className="text-blue-100">
                                                お疲れ様でした！あなたの結果です
                                            </p>
                                        </motion.div>
                                    </div>

                                    <CardContent className="pt-6">
                                        <StaggerContainer>
                                            {/* スコア表示 */}
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: { opacity: 1 },
                                                }}
                                                className="mb-6"
                                            >
                                                <div className="text-center mb-4">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        スコア: {Math.round(scorePercentage)}%
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {getFeedbackMessage()}
                                                    </p>
                                                </div>

                                                <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                                                    <motion.div
                                                        className="bg-blue-600 h-4 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scorePercentage}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                            </motion.div>

                                            {/* 統計情報 */}
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: { opacity: 1 },
                                                }}
                                                className="grid grid-cols-2 gap-4 mb-6"
                                            >
                                                <div className="bg-green-50 p-4 rounded-lg text-center">
                                                    <Check className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {correctAnswers}
                                                    </p>
                                                    <p className="text-sm text-gray-600">正解</p>
                                                </div>
                                                <div className="bg-red-50 p-4 rounded-lg text-center">
                                                    <X className="h-6 w-6 text-red-600 mx-auto mb-1" />
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {incorrectAnswers}
                                                    </p>
                                                    <p className="text-sm text-gray-600">不正解</p>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {Math.round(totalTimeSpent / 1000)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        総所要時間(秒)
                                                    </p>
                                                </div>
                                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                                    <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                                                    <p className="text-2xl font-bold text-purple-600">
                                                        {Math.round(averageTimePerQuestion)}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        平均解答時間(秒)
                                                    </p>
                                                </div>
                                            </motion.div>

                                            {/* 回答履歴 */}
                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: { opacity: 1 },
                                                }}
                                                className="mb-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                    回答履歴
                                                </h3>
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                    {userAnswers.map((answer, index) => (
                                                        <div
                                                            key={answer.quizId}
                                                            className={`flex items-center justify-between p-3 rounded-lg ${
                                                                answer.isCorrect
                                                                    ? 'bg-green-50'
                                                                    : 'bg-red-50'
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <div
                                                                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                                                        answer.isCorrect
                                                                            ? 'bg-green-100'
                                                                            : 'bg-red-100'
                                                                    }`}
                                                                >
                                                                    {answer.isCorrect ? (
                                                                        <Check className="h-4 w-4 text-green-600" />
                                                                    ) : (
                                                                        <X className="h-4 w-4 text-red-600" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {answer.word}
                                                                    </p>
                                                                    <div className="flex text-xs text-gray-600">
                                                                        <span>
                                                                            {answer.isCorrect
                                                                                ? answer.userAnswer
                                                                                : `${answer.userAnswer} → ${answer.correctAnswer}`}
                                                                        </span>
                                                                        <span className="mx-1">
                                                                            •
                                                                        </span>
                                                                        <span>
                                                                            {Math.round(
                                                                                answer.timeSpent /
                                                                                    1000
                                                                            )}
                                                                            秒
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">
                                                                {index + 1}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </StaggerContainer>
                                    </CardContent>

                                    <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
                                        <Button
                                            onClick={handleRetryQuiz}
                                            variant="outline"
                                            className="w-full sm:w-1/2 cursor-pointer"
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            もう一度挑戦
                                        </Button>
                                        <Button
                                            asChild
                                            className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Button
                                                onClick={() => router.push('/student/dashboard')}
                                                className="cursor-pointer"
                                            >
                                                <Home className="mr-2 h-4 w-4" />
                                                ダッシュボードへ
                                            </Button>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </FadeIn>
                        </div>
                    )}
                </main>
            </PageTransition>
        </div>
    );
}
