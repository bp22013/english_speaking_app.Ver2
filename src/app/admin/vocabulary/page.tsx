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
import { VocabularyDownloadButton } from '../../components/VocabularyDataDownloadButton';
import Link from 'next/link';

// サンプル単語データ
interface VocabularyItem {
    id: number;
    word: string;
    meaning: string;
    level: number; // 1-10のレベル
    addedAt: string;
}

const sampleVocabulary: VocabularyItem[] = [
    {
        id: 1,
        word: 'apple',
        meaning: 'りんご',
        level: 1,
        addedAt: '2024年1月15日',
    },
    {
        id: 2,
        word: 'computer',
        meaning: 'コンピューター',
        level: 4,
        addedAt: '2024年1月14日',
    },
    {
        id: 3,
        word: 'book',
        meaning: '本',
        level: 1,
        addedAt: '2024年1月12日',
    },
    {
        id: 4,
        word: 'university',
        meaning: '大学',
        level: 5,
        addedAt: '2024年1月10日',
    },
    {
        id: 5,
        word: 'algorithm',
        meaning: 'アルゴリズム',
        level: 8,
        addedAt: '2024年1月8日',
    },
    {
        id: 6,
        word: 'sophisticated',
        meaning: '洗練された',
        level: 9,
        addedAt: '2024年1月6日',
    },
    {
        id: 7,
        word: 'cat',
        meaning: '猫',
        level: 1,
        addedAt: '2024年1月5日',
    },
    {
        id: 8,
        word: 'phenomenal',
        meaning: '驚異的な',
        level: 10,
        addedAt: '2024年1月3日',
    },
];

export default function AdminVocabulary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [sortField, setSortField] = useState<string>('word');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(sampleVocabulary);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVocabId, setSelectedVocabId] = useState<number | null>(null);

    // フィルタリングと並び替え
    const filteredVocabulary = vocabulary
        .filter((item) => {
            const matchesSearch =
                item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = selectedLevel === 'all' || item.level === parseInt(selectedLevel);
            return matchesSearch && matchesLevel;
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
            } else if (sortField === 'level') {
                return sortDirection === 'asc' ? a.level - b.level : b.level - a.level;
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
                                        <VocabularyDownloadButton data={sampleVocabulary} />
                                        <Button
                                            asChild
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Link href="/admin/vocabulary/create">
                                                <Plus className="mr-2 h-4 w-4" />
                                                単語を追加
                                            </Link>
                                        </Button>
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
                                                            <Badge
                                                                variant="outline"
                                                                className={getLevelColor(
                                                                    item.level
                                                                )}
                                                            >
                                                                {getLevelLabel(item.level)}
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
