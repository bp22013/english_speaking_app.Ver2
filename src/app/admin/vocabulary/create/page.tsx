'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BookOpen, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { AdminNavigation } from '../../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../../components/page-transition';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminVocabularyCreate() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        word: '',
        meaning: '',
        example: '',
        category: '',
        difficulty: 'medium',
        hint: '',
    });

    // 複数の例文を管理
    const [examples, setExamples] = useState<string[]>([]);
    const [newExample, setNewExample] = useState('');

    // カテゴリーの選択肢
    const categories = [
        '果物',
        '野菜',
        '動物',
        'テクノロジー',
        '教育',
        '文房具',
        'スポーツ',
        '食べ物',
        'その他',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddExample = () => {
        if (newExample.trim()) {
            setExamples([...examples, newExample.trim()]);
            setNewExample('');
        }
    };

    const handleRemoveExample = (index: number) => {
        setExamples(examples.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 実際のアプリではここでAPIリクエストを行う
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('Submitted:', { ...formData, examples });

            // 成功したら単語一覧ページに戻る
            router.push('/admin/vocabulary');
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation currentPage="vocabulary" />
            <PageTransition>
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Button variant="ghost" size="icon" asChild className="mr-4">
                                        <Link href="/admin/vocabulary">
                                            <ArrowLeft className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <div>
                                        <motion.h1
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="text-3xl font-bold text-gray-900 mb-2"
                                        >
                                            単語を追加
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            className="text-gray-600"
                                        >
                                            新しい単語をシステムに追加します
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* フォーム */}
                        <SoftFadeIn delay={0.2}>
                            <form onSubmit={handleSubmit}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center space-x-2">
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            <span>単語情報</span>
                                        </CardTitle>
                                        <CardDescription>
                                            単語の基本情報を入力してください
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="word">単語 (英語)</Label>
                                                <Input
                                                    id="word"
                                                    name="word"
                                                    value={formData.word}
                                                    onChange={handleChange}
                                                    placeholder="例: apple"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="meaning">意味 (日本語)</Label>
                                                <Input
                                                    id="meaning"
                                                    name="meaning"
                                                    value={formData.meaning}
                                                    onChange={handleChange}
                                                    placeholder="例: りんご"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">カテゴリー</Label>
                                                <Select
                                                    value={formData.category}
                                                    onValueChange={(value) =>
                                                        handleSelectChange('category', value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="カテゴリーを選択" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="difficulty">難易度</Label>
                                                <Select
                                                    value={formData.difficulty}
                                                    onValueChange={(value) =>
                                                        handleSelectChange('difficulty', value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="easy">簡単</SelectItem>
                                                        <SelectItem value="medium">普通</SelectItem>
                                                        <SelectItem value="hard">難しい</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="hint">ヒント (オプション)</Label>
                                            <Input
                                                id="hint"
                                                name="hint"
                                                value={formData.hint}
                                                onChange={handleChange}
                                                placeholder="例: 赤い果物"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <Label>例文</Label>
                                            <div className="space-y-2">
                                                {examples.map((example, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center"
                                                    >
                                                        <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                                                            {example}
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveExample(index)
                                                            }
                                                            className="ml-2"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newExample}
                                                    onChange={(e) => setNewExample(e.target.value)}
                                                    placeholder="例文を入力"
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleAddExample}
                                                    disabled={!newExample.trim()}
                                                    variant="outline"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    追加
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <Button type="button" variant="outline" asChild>
                                                <Link href="/admin/vocabulary">キャンセル</Link>
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    isSubmitting ||
                                                    !formData.word ||
                                                    !formData.meaning
                                                }
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {isSubmitting ? '保存中...' : '保存'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </SoftFadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
