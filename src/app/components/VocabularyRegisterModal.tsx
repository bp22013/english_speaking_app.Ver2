/* 単語を登録するモーダルコンポーネント */

'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Save, Plus, AlertCircle } from 'lucide-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerWordsDataForm, registerWordsValidation } from '@/lib/validation';
import toast from 'react-hot-toast';
import { client } from '@/lib/HonoClient';

export function VocabularyRegisterDialog() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<registerWordsDataForm>({
        resolver: zodResolver(registerWordsValidation),
        defaultValues: {
            word: '',
            meaning: '',
            difficulty: undefined,
        },
    });

    const handleRegister: SubmitHandler<registerWordsDataForm> = async (data) => {
        setIsSubmitting(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.word.RegisterWords.$post({
                        json: { word: data.word, meaning: data.meaning, level: data.difficulty },
                    });

                    const responceData = await res.json();

                    if (responceData.flg) {
                        resolve(responceData.message);
                        setOpen(false);
                    } else {
                        reject(responceData.message);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: '登録しています...',
                success: '登録しました!',
                error: (messages: string) => messages,
            }
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    setTimeout(() => reset(), 0);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    単語を追加
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[40vw]">
                <form onSubmit={handleSubmit(handleRegister)}>
                    <DialogHeader>
                        <DialogTitle>新しい単語を追加</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="word">単語 (英語)</Label>
                            <Input
                                id="word"
                                autoFocus
                                disabled={isSubmitting}
                                placeholder="例: apple"
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

                        <div className="space-y-2">
                            <Label htmlFor="meaning">意味 (日本語)</Label>
                            <Input
                                id="meaning"
                                placeholder="例: りんご"
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
                                                    ? 'border-red-500 cursor-pointer w-[20vw]'
                                                    : 'cursor-pointer w-[20vw]'
                                            }
                                        >
                                            <SelectValue placeholder="難易度を選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(10)].map((_, i) => (
                                                <SelectItem
                                                    key={i + 1}
                                                    value={(i + 1).toString()}
                                                    className="cursor-pointer"
                                                >
                                                    {i + 1}
                                                </SelectItem>
                                            ))}
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
                            disabled={isSubmitting}
                            className="cursor-pointer"
                            variant="outline"
                            onClick={() => {
                                setTimeout(() => reset(), 0);
                                setOpen(false);
                            }}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? '登録中...' : '登録'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
