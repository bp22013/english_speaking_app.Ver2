/* 単語のページ */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWords } from '@/app/hooks/useWords';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { BookOpen, Search, Filter, Volume2, ArrowUpDown } from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { speak } from '@/lib/WebSpeechApi';
import { VocabularyDownloadButton } from '../../components/VocabularyDataDownloadButton';
import { VocabularyActionsDropdown } from '@/app/components/VocabularyActionsDropdown';
import { VocabularyRegisterDialog } from '../../components/VocabularyRegisterModal';
import { client } from '@/lib/HonoClient';
import Loading from '@/app/loading';
import toast from 'react-hot-toast';

interface VocabularyItem {
    id: string;
    word: string;
    meaning: string | null;
    level: number | null;
    addedAt: string | null;
}

export default function AdminVocabulary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [sortField, setSortField] = useState<string>('word');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedVocabId, setSelectedVocabId] = useState<string | null>(null);
    const { words, isLoading, isError, refetch } = useWords();

    // フィルタリングと並び替え
    const filteredVocabulary = words
        .filter((item: VocabularyItem) => {
            const matchesSearch =
                item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.meaning?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());

            const matchesLevel = selectedLevel === 'all' || item.level === parseInt(selectedLevel);
            return matchesSearch && matchesLevel;
        })
        .sort((a: VocabularyItem, b: VocabularyItem) => {
            if (sortField === 'word') {
                return sortDirection === 'asc'
                    ? a.word.localeCompare(b.word)
                    : b.word.localeCompare(a.word);
            } else if (sortField === 'meaning') {
                return sortDirection === 'asc'
                    ? (a.meaning ?? '').localeCompare(b.meaning ?? '')
                    : (b.meaning ?? '').localeCompare(a.meaning ?? '');
            } else if (sortField === 'level') {
                return sortDirection === 'asc'
                    ? (a.level ?? 0) - (b.level ?? 0)
                    : (b.level ?? 0) - (a.level ?? 0);
            } else if (sortField === 'addedAt') {
                return sortDirection === 'asc'
                    ? new Date(a.addedAt ?? '').getTime() - new Date(b.addedAt ?? '').getTime()
                    : new Date(b.addedAt ?? '').getTime() - new Date(a.addedAt ?? '').getTime();
            }
            return 0;
        });

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 単語を削除
    const handleDeleteVocab = async (vocabId: string) => {
        setIsSubmitting(true);

        await toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.word.deleteWords.$post({
                        json: { id: vocabId },
                    });

                    const data = await res.json();

                    if (data.flg) {
                        await refetch();
                        resolve(data.message);
                    } else {
                        reject(data.message);
                    }
                } catch (error) {
                    console.log(error);
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: '削除中です...',
                success: '削除しました!',
                error: (message: string) => message,
            }
        );
    };

    const getLevelColor = (level: number) => {
        if (level <= 2) {
            return 'bg-green-100 text-green-700 border-green-100';
        } else if (level <= 4) {
            return 'bg-lime-100 text-lime-700 border-lime-100';
        } else if (level <= 6) {
            return 'bg-yellow-100 text-yellow-700 border-yellow-100';
        } else if (level <= 8) {
            return 'bg-orange-100 text-orange-700 border-orange-100';
        } else {
            return 'bg-red-100 text-red-700 border-red-100';
        }
    };

    const getLevelLabel = (level: number) => {
        return `レベル ${level}`;
    };

    const handleSpeak = (text: string) => {
        speak(text, 1);
    };

    if (isLoading || isSubmitting) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation currentPage="vocabulary" />
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
                                        単語管理
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-gray-600"
                                    >
                                        システムに登録されている単語の管理と追加
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mt-4 md:mt-0"
                                >
                                    <div className="space-x-5">
                                        <VocabularyDownloadButton data={words} />
                                        <VocabularyRegisterDialog />
                                    </div>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* 検索とフィルター */}
                        <SoftFadeIn delay={0.2}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="単語または意味で検索..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Select
                                                value={selectedLevel}
                                                onValueChange={setSelectedLevel}
                                            >
                                                <SelectTrigger className="w-[150px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedLevel === 'all'
                                                                ? '全てのレベル'
                                                                : `レベル ${selectedLevel}`}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="all"
                                                        className="cursor-pointer"
                                                    >
                                                        全てのレベル
                                                    </SelectItem>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                                        (level) => (
                                                            <SelectItem
                                                                key={level}
                                                                value={level.toString()}
                                                                className="cursor-pointer"
                                                            >
                                                                レベル {level}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>

                        {/* 単語一覧 */}
                        <SoftFadeIn delay={0.3}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <BookOpen className="w-5 h-5 text-purple-600" />
                                            <span>単語一覧</span>
                                        </CardTitle>
                                        <div className="text-sm text-gray-500">
                                            <p className="text-sm text-gray-500">
                                                {filteredVocabulary.length} / {words.length} 件表示
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('word')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>単語</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('meaning')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>意味</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('level')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>レベル</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('addedAt')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>追加日</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                                                        アクション
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredVocabulary.map((item: VocabularyItem) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-gray-900">
                                                                    {item.word}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="ml-2 h-6 w-6 cursor-pointer"
                                                                    title="発音を聞く"
                                                                    onClick={() =>
                                                                        handleSpeak(item.word)
                                                                    }
                                                                >
                                                                    <Volume2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-700">
                                                            {item.meaning}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {item.level !== null && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={getLevelColor(
                                                                        item.level
                                                                    )}
                                                                >
                                                                    {getLevelLabel(item.level)}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-500 text-sm">
                                                            {item.addedAt
                                                                ? dayjs(item.addedAt).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : '未登録'}
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <VocabularyActionsDropdown
                                                                wordId={item.id}
                                                                word={item.word}
                                                                meaning={item.meaning ?? ''}
                                                                difficulty={item.level ?? 1}
                                                                onDeleted={() =>
                                                                    handleDeleteVocab(item.id)
                                                                }
                                                            />
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {filteredVocabulary.length === 0 && (
                                            <div className="text-center py-8">
                                                <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                                    単語が見つかりません
                                                </h3>
                                                <p className="mt-1 text-gray-500">
                                                    検索条件に一致する単語がありません。別の検索条件を試すか、新しい単語を追加してください。
                                                </p>
                                                <VocabularyRegisterDialog />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
