/* 生徒の設定ページ */

'use client';

import { useState, useEffect } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Save, Camera } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { StudentNavigation } from '../../components/StudentNavigationBar';
import { PasswordChangeDialog } from '../../components/StudentPassChangeModal';
import { LogoutConfirmDialog } from '../../components/StudentLogoutConfirmModal';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import Loading from '@/app/loading';
import dayjs from 'dayjs';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { updateStudentFormData, updateStudentValidation } from '@/lib/validation';
import { client } from '@/lib/HonoClient';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SettingsPage() {
    const { loading, user } = useAuth();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, control } =
        useForm<updateStudentFormData>({
            resolver: zodResolver(updateStudentValidation),
            defaultValues: {
                name: user?.name ?? '',
                studentId: user?.studentId ?? '',
                grade: user?.grade ?? '',
            },
        });

    // userが変更されたときにフォームを更新
    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('studentId', user.studentId || '');
            setValue('grade', user.grade || '');
        } else {
            toast.error('ユーザー情報を読み込めませんでした');
            redirect('/student/dashboard');
        }
    }, [user, setValue]);

    // フォームの値を監視
    const watchedValues = watch();

    // 変更を保存
    const handleSave: SubmitHandler<updateStudentFormData> = async (data) => {
        if (!user) {
            toast.error('ユーザー情報が見つかりません');
            return;
        }

        await toast.promise(
            new Promise<string>(async (resolve, reject) => {
                setIsSaving(true);
                try {
                    const response = await client.api.auth.updateStudentProfile.$post({
                        json: {
                            studentId: user.studentId,
                            name: data.name,
                            grade: data.grade,
                        },
                    });

                    const result = await response.json();

                    if (result.flg) {
                        resolve('設定を保存しました！');
                    } else {
                        reject(result.message || '設定の保存に失敗しました');
                    }
                } catch (error) {
                    console.error('設定保存エラー:', error);
                    reject('設定の保存中にエラーが発生しました');
                } finally {
                    setIsSaving(false);
                }
            }),
            {
                loading: '設定を保存しています...',
                success: (message: string) => message,
                error: (message: string) => message,
            }
        );
    };

    function handlePasswordChange(currentPassword: string, newPassword: string): Promise<void> {
        throw new Error('Function not implemented.');
    }

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    // ユーザー名の初期文字を取得（アバターのフォールバック用）
    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name.length > 1 ? name.substring(0, 2) : name.substring(0, 1);
    };

    // 日付フォーマット関数
    const formatDate = (date: string | null) => {
        if (!date) return '未設定';
        return dayjs(date).format('YYYY / MM / DD');
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-y-scroll">
            <StudentNavigation />
            <PageTransition>
                <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 mb-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                                >
                                    設定
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-sm sm:text-base text-gray-600"
                                >
                                    アカウントと学習設定をカスタマイズしましょう
                                </motion.p>
                            </div>
                        </FadeIn>

                        <form onSubmit={handleSubmit(handleSave)}>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                                {/* プロフィール設定 */}
                                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                                    <SoftFadeIn delay={0.2}>
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="pb-4 sm:pb-6">
                                                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                    <span>プロフィール</span>
                                                </CardTitle>
                                                <CardDescription className="text-xs sm:text-sm">
                                                    基本的な個人情報を管理します
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4 sm:space-y-6 pt-0">
                                                {/* アバター */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.4, duration: 0.6 }}
                                                    className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 300,
                                                        }}
                                                        className="flex-shrink-0"
                                                    >
                                                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                                                            <AvatarImage
                                                                src={
                                                                    '/placeholder.svg?height=80&width=80'
                                                                }
                                                                alt="Profile"
                                                            />
                                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg sm:text-xl">
                                                                {getInitials(watchedValues.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </motion.div>
                                                    <div className="text-center sm:text-left">
                                                        <motion.div
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs sm:text-sm"
                                                                disabled={isSaving}
                                                            >
                                                                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                                写真を変更
                                                            </Button>
                                                        </motion.div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            JPG、PNG形式（最大2MB）
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                {/* 基本情報 */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.5, duration: 0.6 }}
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                                                >
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-xs sm:text-sm"
                                                        >
                                                            名前
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            {...register('name')}
                                                            className="text-xs sm:text-sm h-9 sm:h-10"
                                                            disabled={isSaving}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="studentId"
                                                            className="text-xs sm:text-sm"
                                                        >
                                                            生徒ID
                                                        </Label>
                                                        <Input
                                                            id="studentId"
                                                            type="text"
                                                            {...register('studentId')}
                                                            className="text-xs sm:text-sm h-9 sm:h-10"
                                                            disabled={true} // 生徒IDは変更不可
                                                        />
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6, duration: 0.6 }}
                                                    className="space-y-2"
                                                >
                                                    <Label
                                                        htmlFor="grade"
                                                        className="text-xs sm:text-sm"
                                                    >
                                                        学年
                                                    </Label>
                                                    <Controller
                                                        control={control}
                                                        name="grade"
                                                        render={({ field }) => (
                                                            <Select
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                disabled={isSaving}
                                                            >
                                                                <SelectTrigger className="cursor-pointer w-full h-9 sm:h-10 text-xs sm:text-sm">
                                                                    <SelectValue placeholder="学年を選択してください" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value="中学1年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        中学1年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="中学2年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        中学2年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="中学3年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        中学3年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="高校1年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        高校1年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="高校2年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        高校2年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="高校3年生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        高校3年生
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="大学生"
                                                                        className="cursor-pointer text-xs sm:text-sm"
                                                                    >
                                                                        大学生
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </SoftFadeIn>
                                </div>

                                {/* サイドバー */}
                                <div className="space-y-3 sm:space-y-4">
                                    <SoftFadeIn delay={0.5}>
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="pb-3 sm:pb-4">
                                                <CardTitle className="text-base sm:text-lg">
                                                    アカウント情報
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 sm:space-y-3 pt-0">
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.7, duration: 0.6 }}
                                                >
                                                    <p className="text-xs text-gray-600">登録日</p>
                                                    <p className="font-medium text-sm sm:text-base">
                                                        {user
                                                            ? formatDate(user.registeredAt)
                                                            : '未設定'}
                                                    </p>
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.8, duration: 0.6 }}
                                                >
                                                    <p className="text-xs text-gray-600">
                                                        最終ログイン
                                                    </p>
                                                    <p className="font-medium text-sm sm:text-base">
                                                        {user
                                                            ? formatDate(user.lastLoginAt)
                                                            : '未設定'}
                                                    </p>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </SoftFadeIn>

                                    <SoftFadeIn delay={0.6}>
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="pb-3 sm:pb-4">
                                                <CardTitle className="text-base sm:text-lg">
                                                    アカウント管理
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 sm:space-y-3 pt-0">
                                                <PasswordChangeDialog />
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.9, duration: 0.6 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        className="w-full justify-start cursor-pointer text-xs sm:text-sm h-9 sm:h-10"
                                                        onClick={handleLogoutClick}
                                                        disabled={isSaving}
                                                    >
                                                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                                        ログアウト
                                                    </Button>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </SoftFadeIn>

                                    {/* 保存ボタン - モバイルでは最下部に表示 */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2, duration: 0.6 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="order-last xl:order-none"
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-xs sm:text-sm h-9 sm:h-10"
                                            disabled={isSaving}
                                        >
                                            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            {isSaving ? '保存中...' : '設定を保存'}
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </PageTransition>

            {/* ログアウト確認ダイアログ */}
            {user && (
                <LogoutConfirmDialog
                    open={isLogoutDialogOpen}
                    onOpenChange={setIsLogoutDialogOpen}
                    sessionId={user.sessionId ?? ''}
                    studentId={user.studentId ?? ''}
                />
            )}
        </div>
    );
}
