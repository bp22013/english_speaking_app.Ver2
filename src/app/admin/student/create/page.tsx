/* 生徒を作成するページ */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft, Save, Camera, X } from 'lucide-react';
import { AdminNavigation } from '../../../components/AdminNavigation';
import { adminStudentRegisterFormData, adminStudentRegisterValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, FieldError, Controller } from 'react-hook-form';
import { PageTransition, FadeIn, SoftFadeIn } from '../../../components/page-transition';
import { motion } from 'framer-motion';
import { avatarPlaceholder } from '../../../components/Icon/avatarPlaceholder';
import toast from 'react-hot-toast';
import { client } from '@/lib/HonoClient';

// フォームデータの型定義
interface StudentFormData {
    // 基本情報
    firstName: string;
    lastName: string;

    // 学校情報
    grade: string;
    studentId: string;
    enrollmentDate: string;

    // アカウント情報
    password: string;
    confirmPassword: string;

    // その他
    notes: string;
    avatar?: File;
}

export default function AdminStudentCreate() {
    const [formData, setFormData] = useState<StudentFormData>({
        firstName: '',
        lastName: '',
        grade: '',
        studentId: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        password: '',
        confirmPassword: '',
        notes: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [currentTab, setCurrentTab] = useState('basic');

    // 学年とクラスのオプション
    const gradeOptions = [
        '中学1年生',
        '中学2年生',
        '中学3年生',
        '高校1年生',
        '高校2年生',
        '高校3年生',
    ];

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<adminStudentRegisterFormData>({
        resolver: zodResolver(adminStudentRegisterValidation),
        defaultValues: {
            firstName: '',
            lastName: '',
            grade: '',
            studentId: '',
            enrollmentDate: new Date().toISOString().split('T')[0],
            password: '',
            confirmPassword: '',
            notes: '',
            avatar: undefined,
        },
    });

    // アバター画像の処理
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue('avatar', file);

            setFormData((prev) => ({ ...prev, avatar: file }));

            // プレビュー用のURL作成
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // フォーム送信
    const onSubmit: SubmitHandler<adminStudentRegisterFormData> = async (data) => {
        setIsLoading(true);

        try {
            const res = await client.api.auth.studentRegister.$get({
                json: {},
            });

            const data = await res.json();
            setAvatarPreview(null);
            setCurrentTab('basic');
        } catch {
            toast.error('エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    // 生徒IDを自動生成する関数
    const generateStudentId = () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
    };

    // パスワードを自動生成する関数
    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 space-y-6 overflow-y-scroll">
            <AdminNavigation currentPage="students" />
            <PageTransition>
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.history.back()}
                                        className="cursor-pointer"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div>
                                        <motion.h1
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="text-3xl font-bold text-gray-900"
                                        >
                                            新規生徒追加
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            className="text-gray-600"
                                        >
                                            新しい生徒アカウントを作成します
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* フォーム */}
                        <SoftFadeIn delay={0.2}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <UserPlus className="w-5 h-5 text-purple-600" />
                                            <span>生徒情報入力</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger
                                                    value="basic"
                                                    className="cursor-pointer"
                                                >
                                                    基本情報
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="account"
                                                    className="cursor-pointer"
                                                >
                                                    アカウント
                                                </TabsTrigger>
                                            </TabsList>

                                            {/* 基本情報タブ */}
                                            <TabsContent value="basic" className="space-y-6">
                                                {/* アバター設定 */}
                                                <div className="flex items-center space-x-6 mt-5">
                                                    <div className="relative">
                                                        <Avatar
                                                            className="w-24 h-24"
                                                            onChange={(value) =>
                                                                setValue('avatar', value)
                                                            }
                                                        >
                                                            <AvatarImage
                                                                src={avatarPreview || undefined}
                                                            />
                                                            <AvatarFallback className="bg-white flex items-center justify-center p-1 border border-black">
                                                                {avatarPlaceholder()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <label className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                                                            <Camera className="w-4 h-4" />
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleAvatarChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            プロフィール写真
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            JPG、PNG形式（最大5MB）
                                                        </p>
                                                        {errors.avatar && (
                                                            <p className="text-sm text-red-600 flex items-center mt-1">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {
                                                                    (errors.avatar as FieldError)
                                                                        ?.message
                                                                }
                                                            </p>
                                                        )}

                                                        {avatarPreview && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={isLoading}
                                                                onClick={() => {
                                                                    setAvatarPreview(null);
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        avatar: undefined,
                                                                    }));
                                                                }}
                                                                className="mt-2 text-red-600 hover:text-red-700 cursor-pointer"
                                                            >
                                                                <X className="w-4 h-4 mr-1" />
                                                                削除
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* 名前 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="lastName">姓 *</Label>
                                                        <Input
                                                            id="lastName"
                                                            value={formData.lastName}
                                                            autoFocus
                                                            disabled={isLoading}
                                                            {...register('lastName')}
                                                            placeholder="田中"
                                                            className={
                                                                errors.lastName
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                        {errors.lastName && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.lastName.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="firstName">名 *</Label>
                                                        <Input
                                                            id="firstName"
                                                            value={formData.firstName}
                                                            placeholder="太郎"
                                                            disabled={isLoading}
                                                            className={
                                                                errors.firstName
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                            {...register('firstName')}
                                                        />
                                                        {errors.firstName && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.firstName.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 学年 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="grade">学年 *</Label>
                                                        <Controller
                                                            control={control}
                                                            name="grade"
                                                            render={({ field }) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={(value) =>
                                                                        field.onChange(value)
                                                                    }
                                                                    disabled={isLoading}
                                                                >
                                                                    <SelectTrigger
                                                                        className={
                                                                            errors.grade
                                                                                ? 'border-red-500 cursor-pointer'
                                                                                : 'cursor-pointer'
                                                                        }
                                                                    >
                                                                        <SelectValue placeholder="学年を選択" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {gradeOptions.map(
                                                                            (grade) => (
                                                                                <SelectItem
                                                                                    key={grade}
                                                                                    value={grade}
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    {grade}
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />

                                                        {errors.grade && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.grade.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 登録日 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="enrollmentDate">
                                                            登録日
                                                        </Label>
                                                        <Controller
                                                            name="enrollmentDate"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    id="enrollmentDate"
                                                                    type="date"
                                                                    disabled={isLoading}
                                                                    className={
                                                                        errors.enrollmentDate
                                                                            ? 'border-red-500'
                                                                            : ''
                                                                    }
                                                                    value={field.value ?? ''} // ← ここがポイント
                                                                    onChange={field.onChange}
                                                                />
                                                            )}
                                                        />

                                                        {errors.enrollmentDate && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.enrollmentDate.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* アカウント情報タブ */}
                                            <TabsContent value="account" className="space-y-6 mt-5">
                                                <div className="grid gap-6">
                                                    {/* 生徒ID */}
                                                    <div className="space-y-2 w-full">
                                                        <Label htmlFor="studentId">生徒ID *</Label>
                                                        <div className="flex space-x-2">
                                                            <Input
                                                                id="studentId"
                                                                placeholder="240001"
                                                                disabled={isLoading}
                                                                className={
                                                                    errors.studentId
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                                {...register('studentId')}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={generateStudentId}
                                                                disabled={isLoading}
                                                                className="cursor-pointer"
                                                            >
                                                                生徒ID自動生成
                                                            </Button>
                                                        </div>
                                                        {errors.studentId && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.studentId.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* パスワード */}
                                                    <div className="w-full space-y-2">
                                                        <Label htmlFor="password">
                                                            パスワード *
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            {/* Input + 目のアイコン */}
                                                            <div className="relative w-full">
                                                                <Input
                                                                    id="password"
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    disabled={isLoading}
                                                                    {...register('password')}
                                                                    placeholder="8文字以上"
                                                                    className={
                                                                        errors.password
                                                                            ? 'border-red-500 pr-10'
                                                                            : 'pr-10'
                                                                    }
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    disabled={isLoading}
                                                                    size="icon"
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                                    onClick={() =>
                                                                        setShowPassword(
                                                                            !showPassword
                                                                        )
                                                                    }
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>

                                                            {/* 自動生成ボタン */}
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                disabled={isLoading}
                                                                onClick={generatePassword}
                                                                className="whitespace-nowrap cursor-pointer"
                                                            >
                                                                パスワード自動生成
                                                            </Button>
                                                        </div>
                                                        {errors.password && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.password.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* パスワード確認 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirmPassword">
                                                            パスワード確認 *
                                                        </Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="confirmPassword"
                                                                type={
                                                                    showConfirmPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                disabled={isLoading}
                                                                placeholder="パスワードを再入力"
                                                                className={
                                                                    errors.confirmPassword
                                                                        ? 'border-red-500 pr-10'
                                                                        : 'pr-10'
                                                                }
                                                                {...register('confirmPassword')}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                disabled={isLoading}
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full cursor-pointer"
                                                                onClick={() =>
                                                                    setShowConfirmPassword(
                                                                        !showConfirmPassword
                                                                    )
                                                                }
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {errors.confirmPassword && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.confirmPassword.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        {/* 送信ボタン */}
                                        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="cursor-pointer"
                                            >
                                                キャンセル
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                        作成中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        生徒を追加
                                                    </>
                                                )}
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
