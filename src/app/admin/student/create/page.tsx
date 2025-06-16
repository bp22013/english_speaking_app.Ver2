'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft, Save, Camera, X } from 'lucide-react';
import { AdminNavigation } from '../../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../../components/page-transition';
import { motion } from 'framer-motion';

// フォームデータの型定義
interface StudentFormData {
    // 基本情報
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;

    // 学校情報
    grade: string;
    class: string;
    studentId: string;
    enrollmentDate: string;

    // アカウント情報
    password: string;
    confirmPassword: string;
    sendWelcomeEmail: boolean;
    requirePasswordChange: boolean;

    // 保護者情報
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    relationship: string;

    // 学習設定
    initialLevel: string;
    targetLevel: string;
    weeklyGoal: number;
    preferredStudyTime: string;

    // その他
    notes: string;
    avatar?: File;
}

// バリデーションエラーの型
interface ValidationErrors {
    [key: string]: string;
}

export default function AdminStudentCreate() {
    const [formData, setFormData] = useState<StudentFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        grade: '',
        class: '',
        studentId: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        password: '',
        confirmPassword: '',
        sendWelcomeEmail: true,
        requirePasswordChange: true,
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        relationship: '',
        initialLevel: '',
        targetLevel: '',
        weeklyGoal: 50,
        preferredStudyTime: '',
        notes: '',
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
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

    const classOptions = ['A', 'B', 'C', 'D', 'E'];

    const levelOptions = [
        { value: 'beginner', label: '初級 (CEFR A1-A2)' },
        { value: 'intermediate', label: '中級 (CEFR B1-B2)' },
        { value: 'advanced', label: '上級 (CEFR C1-C2)' },
    ];

    const studyTimeOptions = [
        { value: 'morning', label: '朝 (6:00-9:00)' },
        { value: 'afternoon', label: '午後 (12:00-18:00)' },
        { value: 'evening', label: '夜 (18:00-22:00)' },
        { value: 'flexible', label: 'フレキシブル' },
    ];

    // フォームデータの更新
    const updateFormData = (field: keyof StudentFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // エラーをクリア
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // バリデーション
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // 基本情報のバリデーション
        if (!formData.firstName.trim()) newErrors.firstName = '名前（名）は必須です';
        if (!formData.lastName.trim()) newErrors.lastName = '名前（姓）は必須です';
        if (!formData.email.trim()) {
            newErrors.email = 'メールアドレスは必須です';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }
        if (!formData.grade) newErrors.grade = '学年は必須です';
        if (!formData.class) newErrors.class = 'クラスは必須です';
        if (!formData.studentId.trim()) newErrors.studentId = '学籍番号は必須です';

        // パスワードのバリデーション
        if (!formData.password) {
            newErrors.password = 'パスワードは必須です';
        } else if (formData.password.length < 8) {
            newErrors.password = 'パスワードは8文字以上で入力してください';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'パスワードが一致しません';
        }

        // 保護者情報のバリデーション（任意だが、入力された場合はバリデーション）
        if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
            newErrors.parentEmail = '有効なメールアドレスを入力してください';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // アバター画像の処理
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                // 5MB制限
                setErrors((prev) => ({ ...prev, avatar: 'ファイルサイズは5MB以下にしてください' }));
                return;
            }

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // ここで実際のAPI呼び出しを行う
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 模擬的な遅延

            // 成功時の処理
            alert('生徒が正常に追加されました！');

            // フォームをリセット
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                birthDate: '',
                gender: '',
                grade: '',
                class: '',
                studentId: '',
                enrollmentDate: new Date().toISOString().split('T')[0],
                password: '',
                confirmPassword: '',
                sendWelcomeEmail: true,
                requirePasswordChange: true,
                parentName: '',
                parentEmail: '',
                parentPhone: '',
                relationship: '',
                initialLevel: '',
                targetLevel: '',
                weeklyGoal: 50,
                preferredStudyTime: '',
                notes: '',
            });
            setAvatarPreview(null);
            setCurrentTab('basic');
        } catch (error) {
            alert('エラーが発生しました。もう一度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 自動生成機能
    const generateStudentId = () => {
        const year = new Date().getFullYear().toString().slice(-2);
        const random = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
        updateFormData('studentId', `${year}${random}`);
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        updateFormData('password', password);
        updateFormData('confirmPassword', password);
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="flex space-x-3"
                                >
                                    <Dialog open={previewMode} onOpenChange={setPreviewMode}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <Eye className="mr-2 h-4 w-4" />
                                                プレビュー
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>生徒情報プレビュー</DialogTitle>
                                                <DialogDescription>
                                                    入力された情報の確認
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="w-16 h-16">
                                                        <AvatarImage
                                                            src={
                                                                avatarPreview || '/placeholder.svg'
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                                                            {formData.firstName.charAt(0) || '?'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="text-xl font-semibold">
                                                            {formData.lastName} {formData.firstName}
                                                        </h3>
                                                        <p className="text-gray-600">
                                                            {formData.grade} {formData.class}組
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            学籍番号: {formData.studentId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium">メール:</span>{' '}
                                                        {formData.email}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">電話:</span>{' '}
                                                        {formData.phone || '未設定'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            初期レベル:
                                                        </span>{' '}
                                                        {formData.initialLevel || '未設定'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">
                                                            週間目標:
                                                        </span>{' '}
                                                        {formData.weeklyGoal}単語
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* フォーム */}
                        <SoftFadeIn delay={0.2}>
                            <form onSubmit={handleSubmit}>
                                <Card className="hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <UserPlus className="w-5 h-5 text-purple-600" />
                                            <span>生徒情報入力</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                                            <TabsList className="grid w-full grid-cols-4">
                                                <TabsTrigger value="basic">基本情報</TabsTrigger>
                                                <TabsTrigger value="account">
                                                    アカウント
                                                </TabsTrigger>
                                                <TabsTrigger value="parent">保護者情報</TabsTrigger>
                                                <TabsTrigger value="settings">学習設定</TabsTrigger>
                                            </TabsList>

                                            {/* 基本情報タブ */}
                                            <TabsContent value="basic" className="space-y-6">
                                                {/* アバター設定 */}
                                                <div className="flex items-center space-x-6">
                                                    <div className="relative">
                                                        <Avatar className="w-24 h-24">
                                                            <AvatarImage
                                                                src={
                                                                    avatarPreview ||
                                                                    '/placeholder.svg'
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
                                                                {formData.firstName.charAt(0) ||
                                                                    '?'}
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
                                                        {avatarPreview && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setAvatarPreview(null);
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        avatar: undefined,
                                                                    }));
                                                                }}
                                                                className="mt-2 text-red-600 hover:text-red-700"
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
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'lastName',
                                                                    e.target.value
                                                                )
                                                            }
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
                                                                {errors.lastName}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="firstName">名 *</Label>
                                                        <Input
                                                            id="firstName"
                                                            value={formData.firstName}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'firstName',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="太郎"
                                                            className={
                                                                errors.firstName
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                        {errors.firstName && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.firstName}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* メールアドレス */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">
                                                            メールアドレス *
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'email',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="student@example.com"
                                                            className={
                                                                errors.email ? 'border-red-500' : ''
                                                            }
                                                        />
                                                        {errors.email && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.email}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 電話番号 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">電話番号</Label>
                                                        <Input
                                                            id="phone"
                                                            value={formData.phone}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'phone',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="090-1234-5678"
                                                        />
                                                    </div>

                                                    {/* 生年月日 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="birthDate">生年月日</Label>
                                                        <Input
                                                            id="birthDate"
                                                            type="date"
                                                            value={formData.birthDate}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'birthDate',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {/* 性別 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gender">性別</Label>
                                                        <Select
                                                            value={formData.gender}
                                                            onValueChange={(value) =>
                                                                updateFormData('gender', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="選択してください" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="male">
                                                                    男性
                                                                </SelectItem>
                                                                <SelectItem value="female">
                                                                    女性
                                                                </SelectItem>
                                                                <SelectItem value="other">
                                                                    その他
                                                                </SelectItem>
                                                                <SelectItem value="prefer-not-to-say">
                                                                    回答しない
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* 学年 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="grade">学年 *</Label>
                                                        <Select
                                                            value={formData.grade}
                                                            onValueChange={(value) =>
                                                                updateFormData('grade', value)
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={
                                                                    errors.grade
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            >
                                                                <SelectValue placeholder="学年を選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {gradeOptions.map((grade) => (
                                                                    <SelectItem
                                                                        key={grade}
                                                                        value={grade}
                                                                    >
                                                                        {grade}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.grade && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.grade}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* クラス */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="class">クラス *</Label>
                                                        <Select
                                                            value={formData.class}
                                                            onValueChange={(value) =>
                                                                updateFormData('class', value)
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className={
                                                                    errors.class
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            >
                                                                <SelectValue placeholder="クラスを選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {classOptions.map((cls) => (
                                                                    <SelectItem
                                                                        key={cls}
                                                                        value={cls}
                                                                    >
                                                                        {cls}組
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {errors.class && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.class}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 学籍番号 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="studentId">
                                                            学籍番号 *
                                                        </Label>
                                                        <div className="flex space-x-2">
                                                            <Input
                                                                id="studentId"
                                                                value={formData.studentId}
                                                                onChange={(e) =>
                                                                    updateFormData(
                                                                        'studentId',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="240001"
                                                                className={
                                                                    errors.studentId
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={generateStudentId}
                                                            >
                                                                自動生成
                                                            </Button>
                                                        </div>
                                                        {errors.studentId && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.studentId}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 入学日 */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="enrollmentDate">
                                                            入学日
                                                        </Label>
                                                        <Input
                                                            id="enrollmentDate"
                                                            type="date"
                                                            value={formData.enrollmentDate}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'enrollmentDate',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* アカウント情報タブ */}
                                            <TabsContent value="account" className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* パスワード */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="password">
                                                            パスワード *
                                                        </Label>
                                                        <div className="flex space-x-2">
                                                            <div className="relative flex-1">
                                                                <Input
                                                                    id="password"
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    value={formData.password}
                                                                    onChange={(e) =>
                                                                        updateFormData(
                                                                            'password',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="8文字以上"
                                                                    className={
                                                                        errors.password
                                                                            ? 'border-red-500'
                                                                            : ''
                                                                    }
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute right-0 top-0 h-full"
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
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={generatePassword}
                                                            >
                                                                自動生成
                                                            </Button>
                                                        </div>
                                                        {errors.password && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.password}
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
                                                                value={formData.confirmPassword}
                                                                onChange={(e) =>
                                                                    updateFormData(
                                                                        'confirmPassword',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="パスワードを再入力"
                                                                className={
                                                                    errors.confirmPassword
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full"
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
                                                                {errors.confirmPassword}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* アカウント設定 */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        アカウント設定
                                                    </h3>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>ウェルカムメール送信</Label>
                                                            <p className="text-sm text-gray-500">
                                                                アカウント作成時にログイン情報をメールで送信
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={formData.sendWelcomeEmail}
                                                            onCheckedChange={(checked) =>
                                                                updateFormData(
                                                                    'sendWelcomeEmail',
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <Label>
                                                                初回ログイン時パスワード変更を要求
                                                            </Label>
                                                            <p className="text-sm text-gray-500">
                                                                セキュリティ向上のため推奨されます
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={formData.requirePasswordChange}
                                                            onCheckedChange={(checked) =>
                                                                updateFormData(
                                                                    'requirePasswordChange',
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* 保護者情報タブ */}
                                            <TabsContent value="parent" className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="parentName">
                                                            保護者氏名
                                                        </Label>
                                                        <Input
                                                            id="parentName"
                                                            value={formData.parentName}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'parentName',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="田中花子"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="relationship">続柄</Label>
                                                        <Select
                                                            value={formData.relationship}
                                                            onValueChange={(value) =>
                                                                updateFormData(
                                                                    'relationship',
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="選択してください" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="mother">
                                                                    母
                                                                </SelectItem>
                                                                <SelectItem value="father">
                                                                    父
                                                                </SelectItem>
                                                                <SelectItem value="guardian">
                                                                    保護者
                                                                </SelectItem>
                                                                <SelectItem value="other">
                                                                    その他
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="parentEmail">
                                                            保護者メールアドレス
                                                        </Label>
                                                        <Input
                                                            id="parentEmail"
                                                            type="email"
                                                            value={formData.parentEmail}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'parentEmail',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="parent@example.com"
                                                            className={
                                                                errors.parentEmail
                                                                    ? 'border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                        {errors.parentEmail && (
                                                            <p className="text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                                {errors.parentEmail}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="parentPhone">
                                                            保護者電話番号
                                                        </Label>
                                                        <Input
                                                            id="parentPhone"
                                                            value={formData.parentPhone}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'parentPhone',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="090-1234-5678"
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            {/* 学習設定タブ */}
                                            <TabsContent value="settings" className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="initialLevel">
                                                            初期レベル
                                                        </Label>
                                                        <Select
                                                            value={formData.initialLevel}
                                                            onValueChange={(value) =>
                                                                updateFormData(
                                                                    'initialLevel',
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="レベルを選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {levelOptions.map((level) => (
                                                                    <SelectItem
                                                                        key={level.value}
                                                                        value={level.value}
                                                                    >
                                                                        {level.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="targetLevel">
                                                            目標レベル
                                                        </Label>
                                                        <Select
                                                            value={formData.targetLevel}
                                                            onValueChange={(value) =>
                                                                updateFormData('targetLevel', value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="目標レベルを選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {levelOptions.map((level) => (
                                                                    <SelectItem
                                                                        key={level.value}
                                                                        value={level.value}
                                                                    >
                                                                        {level.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="weeklyGoal">
                                                            週間学習目標（単語数）
                                                        </Label>
                                                        <Input
                                                            id="weeklyGoal"
                                                            type="number"
                                                            min="1"
                                                            max="500"
                                                            value={formData.weeklyGoal}
                                                            onChange={(e) =>
                                                                updateFormData(
                                                                    'weeklyGoal',
                                                                    Number.parseInt(
                                                                        e.target.value
                                                                    ) || 0
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="preferredStudyTime">
                                                            希望学習時間帯
                                                        </Label>
                                                        <Select
                                                            value={formData.preferredStudyTime}
                                                            onValueChange={(value) =>
                                                                updateFormData(
                                                                    'preferredStudyTime',
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="時間帯を選択" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {studyTimeOptions.map((time) => (
                                                                    <SelectItem
                                                                        key={time.value}
                                                                        value={time.value}
                                                                    >
                                                                        {time.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="notes">備考</Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={formData.notes}
                                                        onChange={(e) =>
                                                            updateFormData('notes', e.target.value)
                                                        }
                                                        placeholder="特記事項があれば入力してください"
                                                        rows={4}
                                                    />
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        {/* 送信ボタン */}
                                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                            >
                                                キャンセル
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                {isSubmitting ? (
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
