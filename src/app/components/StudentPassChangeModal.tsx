/* 生徒のパスワード変更用モーダルコンポーネント */

'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    studentPasswordChangeFormData,
    studentPasswordChangeValidation,
    getPasswordStrength,
} from '@/lib/validation';
import { client } from '@/lib/HonoClient';

interface PasswordChangeDialogProps {
    onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordChangeDialog({ onPasswordChange }: PasswordChangeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<studentPasswordChangeFormData>({
        resolver: zodResolver(studentPasswordChangeValidation),
        mode: 'onChange',
    });

    const newPassword = watch('newPassword');
    const confirmPassword = watch('confirmPassword');
    const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

    const onSubmit: SubmitHandler<studentPasswordChangeFormData> = async (data) => {
        await toast.promise(
            new Promise(async (resolve, reject) => {
                setIsSubmitting(true);
                try {
                    const res = await client.api.auth.changeStudentPassword.$post({
                        json: {
                            studentId: user?.studentId,
                            currentPassword: data.currentPassword,
                            newPassword: data.newPassword,
                        },
                    });

                    const responceData = await res.json();

                    if (responceData.flg) {
                        resolve(responceData.message);
                        setIsOpen(false);
                    } else {
                        reject(responceData.message);
                    }
                    resolve('パスワードを変更しました！');
                } catch (err) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: 'パスワードを変更しています...',
                success: 'パスワードを変更しました!',
                error: (message: string) => message,
            }
        );
    };

    const resetForm = () => {
        reset();
        setIsSubmitting(false);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start cursor-pointer">
                    <Shield className="w-4 h-4 mr-2" />
                    パスワード変更
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        パスワード変更
                    </DialogTitle>
                    <DialogDescription>
                        安全なパスワードを設定して、アカウントを保護しましょう。
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-sm font-medium">
                            現在のパスワード
                        </Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? 'text' : 'password'}
                                {...register('currentPassword')}
                                className="pr-10"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-sm font-medium">
                            新しいパスワード
                        </Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                {...register('newPassword')}
                                className="pr-10"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}

                        {passwordStrength && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-600">パスワードの強度</span>
                                    <span className="text-xs font-medium">
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: passwordStrength.width }}
                                        className={`h-full ${passwordStrength.color}`}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {passwordStrength.message}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium">
                            新しいパスワード（確認）
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className="pr-10"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                        {!errors.confirmPassword &&
                            confirmPassword &&
                            newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">
                                    パスワードが一致しません
                                </p>
                            )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                            className="cursor-pointer"
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    処理中...
                                </>
                            ) : (
                                '変更を保存'
                            )}
                        </Button>
                    </DialogFooter>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}
