/* 生徒を編集するモーダル */

'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { client } from '@/lib/HonoClient';
import { Save, AlertCircle } from 'lucide-react';
import { updateStudentFormData, updateStudentValidation } from '@/lib/validation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const grades = ['中学1年生', '中学2年生', '中学3年生', '高校1年生', '高校2年生', '高校3年生'];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentId: string;
    studentName: string;
    grade: string | null;
};

export const StudentEditModal = ({ open, onOpenChange, studentId, grade, studentName }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<updateStudentFormData>({
        resolver: zodResolver(updateStudentValidation),
        defaultValues: {
            name: studentName,
            studentId: studentId,
            grade: grade ?? '',
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: studentName,
                studentId: studentId,
                grade: grade ?? '',
            });
        }
    }, [open, studentName, studentId, grade, reset]);

    const onSubmit: SubmitHandler<updateStudentFormData> = async (data) => {
        setIsSubmitting(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.auth.updateStudent.$post({
                        json: {
                            studentId,
                            name: data.name,
                            grade: data.grade,
                        },
                    });
                    const result = await res.json();
                    if (result.flg) {
                        resolve(result.message);
                        onOpenChange(false);
                        window.location.reload();
                    } else {
                        reject(result.message);
                    }
                } catch (err) {
                    reject('更新に失敗しました');
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: '更新中...',
                success: '更新しました！',
                error: (msg: string) => msg,
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>生徒情報を編集</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* 生徒ID */}
                        <div className="space-y-2">
                            <Label htmlFor="studentId">生徒ID</Label>
                            <Input id="studentId" disabled={true} {...register('studentId')} />
                        </div>

                        {/* 名前 */}
                        <div className="space-y-2">
                            <Label htmlFor="name">名前</Label>
                            <Input
                                id="name"
                                disabled={isSubmitting}
                                {...register('name')}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* 学年 */}
                        <div className="space-y-2">
                            <Label htmlFor="grade">学年</Label>
                            <Controller
                                name="grade"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        <SelectTrigger
                                            className={`w-full ${
                                                errors.grade
                                                    ? 'border-red-500 cursor-pointer'
                                                    : 'cursor-pointer'
                                            }`}
                                        >
                                            <SelectValue placeholder="学年を選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((g) => (
                                                <SelectItem
                                                    key={g}
                                                    value={g}
                                                    className="cursor-pointer"
                                                >
                                                    {g}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.grade && (
                                <p className="text-sm text-red-600 flex items-center mt-1">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.grade.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? '保存中...' : '保存'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
