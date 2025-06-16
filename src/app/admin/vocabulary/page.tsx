'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
    BookOpen,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Volume2,
    ArrowUpDown,
    X,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import { speak } from '@/lib/WebSpeechApi';
import Link from 'next/link';

// サンプル単語データ
interface VocabularyItem {
    id: number;
    word: string;
    meaning: string;
    example: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    addedAt: string;
}

const sampleVocabulary: VocabularyItem[] = [
    {
        id: 1,
        word: 'apple',
        meaning: 'りんご',
        example: 'I eat an apple every day.',
        category: '果物',
        difficulty: 'easy',
        addedAt: '2024年1月15日',
    },
    {
        id: 2,
        word: 'computer',
        meaning: 'コンピューター',
        example: 'I use my computer to study English.',
        category: 'テクノロジー',
        difficulty: 'medium',
        addedAt: '2024年1月14日',
    },
    {
        id: 3,
        word: 'book',
        meaning: '本',
        example: 'I read a book before bed.',
        category: '文房具',
        difficulty: 'easy',
        addedAt: '2024年1月12日',
    },
    {
        id: 4,
        word: 'university',
        meaning: '大学',
        example: 'She studies at the university.',
        category: '教育',
        difficulty: 'medium',
        addedAt: '2024年1月10日',
    },
    {
        id: 5,
        word: 'algorithm',
        meaning: 'アルゴリズム',
        example: 'The algorithm solves the problem efficiently.',
        category: 'テクノロジー',
        difficulty: 'hard',
        addedAt: '2024年1月8日',
    },
];

export default function AdminVocabulary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [sortField, setSortField] = useState<string>('word');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(sampleVocabulary);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVocabId, setSelectedVocabId] = useState<number | null>(null);

    // カテゴリーの一覧を取得
    const categories = Array.from(new Set(vocabulary.map((item) => item.category)));

    // フィルタリングと並び替え
    const filteredVocabulary = vocabulary
        .filter((item) => {
            const matchesSearch =
                item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === 'all' || item.category === selectedCategory;
            const matchesDifficulty =
                selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
            return matchesSearch && matchesCategory && matchesDifficulty;
        })
        .sort((a, b) => {
            if (sortField === 'word') {
                return sortDirection === 'asc'
                    ? a.word.localeCompare(b.word)
                    : b.word.localeCompare(a.word);
            } else if (sortField === 'meaning') {
                return sortDirection === 'asc'
                    ? a.meaning.localeCompare(b.meaning)
                    : b.meaning.localeCompare(a.meaning);
            } else if (sortField === 'difficulty') {
                const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                return sortDirection === 'asc'
                    ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
                    : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
            } else if (sortField === 'addedAt') {
                return sortDirection === 'asc'
                    ? new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
                    : new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
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

    const handleDeleteVocab = () => {
        if (selectedVocabId !== null) {
            setVocabulary(vocabulary.filter((item) => item.id !== selectedVocabId));
            setIsDeleteDialogOpen(false);
            setSelectedVocabId(null);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-700 border-green-100';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-100';
            case 'hard':
                return 'bg-red-100 text-red-700 border-red-100';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-100';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '簡単';
            case 'medium':
                return '普通';
            case 'hard':
                return '難しい';
            default:
                return difficulty;
        }
    };

    const handleSpeak = (text: string) => {
        speak(text, 1);
    };

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
                                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                                        <Link href="/admin/vocabulary/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            単語を追加
                                        </Link>
                                    </Button>
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
                                                value={selectedCategory}
                                                onValueChange={setSelectedCategory}
                                            >
                                                <SelectTrigger className="w-[180px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedCategory === 'all'
                                                                ? '全てのカテゴリー'
                                                                : selectedCategory}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="all"
                                                        className="cursor-pointer"
                                                    >
                                                        全てのカテゴリー
                                                    </SelectItem>
                                                    {categories.map((category) => (
                                                        <SelectItem
                                                            key={category}
                                                            value={category}
                                                            className="cursor-pointer"
                                                        >
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={selectedDifficulty}
                                                onValueChange={setSelectedDifficulty}
                                            >
                                                <SelectTrigger className="w-[150px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedDifficulty === 'all'
                                                                ? '全ての難易度'
                                                                : getDifficultyLabel(
                                                                      selectedDifficulty
                                                                  )}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="all"
                                                        className="cursor-pointer"
                                                    >
                                                        全ての難易度
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="easy"
                                                        className="cursor-pointer"
                                                    >
                                                        簡単
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="medium"
                                                        className="cursor-pointer"
                                                    >
                                                        普通
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="hard"
                                                        className="cursor-pointer"
                                                    >
                                                        難しい
                                                    </SelectItem>
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
                                        <p className="text-sm text-gray-500">
                                            {filteredVocabulary.length} / {vocabulary.length} 件表示
                                        </p>
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
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                                        カテゴリー
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('difficulty')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>難易度</span>
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
                                                {filteredVocabulary.map((item) => (
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
                                                            <Badge variant="outline">
                                                                {item.category}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Badge
                                                                variant="outline"
                                                                className={getDifficultyColor(
                                                                    item.difficulty
                                                                )}
                                                            >
                                                                {getDifficultyLabel(
                                                                    item.difficulty
                                                                )}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-500 text-sm">
                                                            {item.addedAt}
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <DropdownMenuLabel className="cursor-pointer">
                                                                        アクション
                                                                    </DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        asChild
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Link
                                                                            href={`/admin/vocabulary/edit/${item.id}`}
                                                                        >
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            編集
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setSelectedVocabId(
                                                                                item.id
                                                                            );
                                                                            setIsDeleteDialogOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                        className="text-red-600 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        削除
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
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
                                                <Button
                                                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                                                    asChild
                                                >
                                                    <Link href="/admin/vocabulary/create">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        単語を追加
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>
                    </div>
                </main>
            </PageTransition>

            {/* 削除確認ダイアログ */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            単語を削除
                        </DialogTitle>
                        <DialogDescription>
                            この単語を削除してもよろしいですか？この操作は元に戻せません。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            <X className="mr-2 h-4 w-4" />
                            キャンセル
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteVocab}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
