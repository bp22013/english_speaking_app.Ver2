'use client';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Edit, Trash2, Save, AlertCircle, MoreVertical, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerWordsDataForm, registerWordsValidation } from '@/lib/validation';
import toast from 'react-hot-toast';
import { client } from '@/lib/HonoClient';

type Props = {
    wordId: string;
    word: string;
    meaning: string;
    difficulty: number;
    onDeleted?: () => void;
};

export const VocabularyActionsDropdown = ({
    wordId,
    word,
    meaning,
    difficulty,
    onDeleted,
}: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = {
        word,
        meaning,
        difficulty: difficulty.toString() as `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`,
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<registerWordsDataForm>({
        resolver: zodResolver(registerWordsValidation),
        defaultValues,
    });

    const handleEdit = async (data: registerWordsDataForm) => {
        setIsSubmitting(true);
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.word.updateWords.$post({
                        json: {
                            id: wordId,
                            word: data.word,
                            meaning: data.meaning,
                            level: data.difficulty,
                        },
                    });
                    const result = await res.json();
                    if (result.flg) {
                        resolve(result.message);
                        setIsEditOpen(false);
                        window.location.reload();
                    } else {
                        reject(result.message);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: '更新中です...',
                success: '更新しました！',
                error: (msg) => msg,
            }
        );
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.word.deleteWords.$post({ json: { id: wordId } });
                    const data = await res.json();
                    if (data.flg) {
                        resolve(data.message);
                        setIsDeleteOpen(false);
                        onDeleted?.();
                        window.location.reload();
                    } else {
                        reject(data.message);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: '削除中です...',
                success: '削除しました！',
                error: (msg) => msg,
            }
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>アクション</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsEditOpen(true)}
                        className="text-blue-500 cursor-pointer hover:!bg-blue-100 focus:!text-blue-600 focus:!bg-blue-100"
                    >
                        <Edit className="mr-2 h-4 w-4 text-blue-500" />
                        編集
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        className="text-red-600 cursor-pointer hover:!bg-red-100 focus:!text-red-600 focus:!bg-red-100"
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                        削除
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 編集モーダル */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-[40vw]">
                    <form onSubmit={handleSubmit(handleEdit)}>
                        <DialogHeader>
                            <DialogTitle>単語を編集</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Word */}
                            <div className="space-y-2">
                                <Label htmlFor="word">単語（英語）</Label>
                                <Input
                                    id="word"
                                    disabled={isSubmitting}
                                    {...register('word')}
                                    className={errors.word ? 'border-red-500' : ''}
                                />
                                {errors.word && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.word.message}
                                    </p>
                                )}
                            </div>

                            {/* Meaning */}
                            <div className="space-y-2">
                                <Label htmlFor="meaning">意味（日本語）</Label>
                                <Input
                                    id="meaning"
                                    disabled={isSubmitting}
                                    {...register('meaning')}
                                    className={errors.meaning ? 'border-red-500' : ''}
                                />
                                {errors.meaning && (
                                    <p className="text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.meaning.message}
                                    </p>
                                )}
                            </div>

                            {/* Difficulty */}
                            <div className="space-y-2">
                                <Label htmlFor="difficulty">難易度</Label>
                                <Controller
                                    name="difficulty"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger
                                                className={
                                                    errors.difficulty
                                                        ? 'border-red-500 w-[20vw] cursor-pointer'
                                                        : 'w-[20vw] cursor-pointer'
                                                }
                                            >
                                                <SelectValue placeholder="難易度を選択" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[...Array(10)].map((_, i) => {
                                                    const value = (i + 1).toString();
                                                    return (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                            className="cursor-pointer"
                                                        >
                                                            {value}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.difficulty && (
                                    <p className="text-sm text-red-600 flex items-center mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.difficulty.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setIsEditOpen(false)}
                                disabled={isSubmitting}
                            >
                                キャンセル
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? '保存中...' : '保存'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 削除モーダル */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-[40vw]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 cursor-pointer">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            単語を削除
                        </DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 text-sm text-gray-800">
                        この単語を削除してもよろしいですか？この操作は元に戻せません。
                    </p>
                    <p className="text-red-600 font-semibold mt-2">
                        <span className="text-black">削除対象 :　</span>
                        {word}
                    </p>
                    <DialogFooter className="gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            className="cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4" />
                            キャンセル
                        </Button>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
