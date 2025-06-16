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
import { Shield, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordChangeDialogProps {
    onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordChangeDialog({ onPasswordChange }: PasswordChangeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // パスワードの強度チェック
    const checkPasswordStrength = (password: string) => {
        if (password.length < 8)
            return { strength: 'weak', message: 'パスワードは8文字以上必要です' };
        if (!/[A-Z]/.test(password))
            return { strength: 'medium', message: '大文字を含めてください' };
        if (!/[0-9]/.test(password)) return { strength: 'medium', message: '数字を含めてください' };
        if (!/[^A-Za-z0-9]/.test(password))
            return { strength: 'good', message: '特殊文字を含めるとより安全です' };
        return { strength: 'strong', message: 'パスワードの強度は十分です' };
    };

    const passwordStrength = checkPasswordStrength(newPassword);

    const getStrengthColor = () => {
        switch (passwordStrength.strength) {
            case 'weak':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'good':
                return 'bg-blue-500';
            case 'strong':
                return 'bg-green-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getStrengthWidth = () => {
        switch (passwordStrength.strength) {
            case 'weak':
                return 'w-1/4';
            case 'medium':
                return 'w-2/4';
            case 'good':
                return 'w-3/4';
            case 'strong':
                return 'w-full';
            default:
                return 'w-0';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 入力検証
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('すべての項目を入力してください');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('新しいパスワードと確認用パスワードが一致しません');
            return;
        }

        if (passwordStrength.strength === 'weak') {
            setError('パスワードが弱すぎます。8文字以上で設定してください');
            return;
        }

        setIsSubmitting(true);

        try {
            // 実際のアプリではここでAPIリクエストを行う
            if (onPasswordChange) {
                await onPasswordChange(currentPassword, newPassword);
            } else {
                // デモ用の遅延
                await new Promise((resolve) => setTimeout(resolve, 1500));
            }

            setSuccess(true);
            // 成功後、フォームをリセット
            setTimeout(() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setIsSubmitting(false);
                // 成功メッセージを表示した後、ダイアログを閉じる
                setTimeout(() => {
                    setIsOpen(false);
                    setSuccess(false);
                }, 1500);
            }, 500);
        } catch (err) {
            setIsSubmitting(false);
            setError('パスワードの変更に失敗しました。現在のパスワードが正しいか確認してください');
        }
    };

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(false);
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

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-6"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-600 mb-2">
                                パスワードを変更しました
                            </h3>
                            <p className="text-gray-600 text-center">
                                新しいパスワードでログインできます
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleSubmit}
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
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password" className="text-sm font-medium">
                                    新しいパスワード
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
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

                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-600">
                                                パスワードの強度
                                            </span>
                                            <span className="text-xs font-medium">
                                                {passwordStrength.strength === 'weak'
                                                    ? '弱い'
                                                    : passwordStrength.strength === 'medium'
                                                    ? '普通'
                                                    : passwordStrength.strength === 'good'
                                                    ? '良い'
                                                    : '強い'}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: '0%' }}
                                                animate={{ width: getStrengthWidth() }}
                                                className={`h-full ${getStrengthColor()}`}
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
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">
                                        パスワードが一致しません
                                    </p>
                                )}
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 p-3 rounded-md text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

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
                                    className="cursor-pointer"
                                    disabled={
                                        isSubmitting ||
                                        !currentPassword ||
                                        !newPassword ||
                                        !confirmPassword ||
                                        newPassword !== confirmPassword
                                    }
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
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
