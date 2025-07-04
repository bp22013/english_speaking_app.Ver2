'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    User,
    Save,
    Key,
    Download,
    Eye,
    EyeOff,
    Loader2,
    FileSpreadsheet,
    FileText,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAdminSession } from '@/app/context/AdminAuthContext';
import { DataExportDropdown } from '../../components/DataExportDropdown';
import { useStudents } from '@/app/hooks/useStudents';
import { useWords } from '@/app/hooks/useWords';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    adminProfileUpdateValidation,
    adminPasswordChangeValidation,
    type AdminProfileUpdateFormData,
    type AdminPasswordChangeFormData
} from '@/lib/validation';

export default function AdminSettings() {
    const { user } = useAdminSession();
    const { students, isLoading: studentsLoading } = useStudents();
    const { words, isLoading: wordsLoading } = useWords();
    const [activeTab, setActiveTab] = useState('profile');
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [statisticsData, setStatisticsData] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    // プロフィール更新フォーム
    const profileForm = useForm<AdminProfileUpdateFormData>({
        resolver: zodResolver(adminProfileUpdateValidation),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    // パスワード変更フォーム
    const passwordForm = useForm<AdminPasswordChangeFormData>({
        resolver: zodResolver(adminPasswordChangeValidation),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // ユーザー情報が更新されたらフォームの初期値を更新
    React.useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user, profileForm]);


    const handleProfileSave = async (data: AdminProfileUpdateFormData) => {
        if (!user?.id) {
            toast.error('ユーザー情報が取得できません');
            return;
        }

        try {
            const response = await fetch('/api/auth/updateAdminProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminId: user.id,
                    name: data.name,
                    email: data.email,
                }),
            });

            const result = await response.json();

            if (result.flg) {
                toast.success('プロフィールを更新しました');
            } else {
                toast.error(result.message || 'プロフィールの更新に失敗しました');
            }
        } catch (error) {
            console.error('プロフィール更新エラー:', error);
            toast.error('プロフィールの更新に失敗しました');
        }
    };


    const handlePasswordChange = async (data: AdminPasswordChangeFormData) => {
        if (!user?.id) {
            toast.error('ユーザー情報が取得できません');
            return;
        }

        try {
            const response = await fetch('/api/auth/updateAdminProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminId: user.id,
                    name: profileForm.getValues().name,
                    email: profileForm.getValues().email,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (result.flg) {
                toast.success('パスワードを変更しました');
                passwordForm.reset();
                setIsPasswordDialogOpen(false);
            } else {
                toast.error(result.message || 'パスワード変更に失敗しました');
            }
        } catch (error) {
            console.error('パスワード変更エラー:', error);
            toast.error('パスワード変更に失敗しました');
        }
    };

    // 学習統計データを取得
    const loadStatisticsData = async () => {
        setIsLoadingStats(true);
        try {
            const response = await fetch('/api/auth/exportStatistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ format: 'json' }),
            });
            const data = await response.json();
            if (data.flg) {
                setStatisticsData(data.data);
            }
        } catch (error) {
            console.error('統計データ取得エラー:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    // タブが統計に切り替わった時にデータを取得
    React.useEffect(() => {
        if (activeTab === 'export' && statisticsData.length === 0) {
            loadStatisticsData();
        }
    }, [activeTab]);

    // データをエクスポート用にフォーマット
    const formatStudentsData = () => {
        if (!students || students.length === 0) return [];
        return students.map((student: { studentId: any; name: any; grade: any; registeredAt: string | number | Date; lastLoginAt: string | number | Date; }) => ({
            '生徒ID': student.studentId || '',
            '名前': student.name || '',
            '学年': student.grade || '',
            '登録日': student.registeredAt ? new Date(student.registeredAt).toLocaleDateString('ja-JP') : '',
            '最終ログイン': student.lastLoginAt ? new Date(student.lastLoginAt).toLocaleDateString('ja-JP') : '',
        }));
    };

    const formatWordsData = () => {
        if (!words || words.length === 0) return [];
        return words.map((word: { id: any; word: any; meaning: any; level: any; addedAt: string | number | Date; }) => ({
            'ID': word.id || '',
            '単語': word.word || '',
            '意味': word.meaning || '',
            'レベル': word.level || '',
            '追加日': word.addedAt ? new Date(word.addedAt).toLocaleDateString('ja-JP') : '',
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-y-scroll">
            <AdminNavigation currentPage="settings" />
            <PageTransition>
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                >
                                    管理者設定
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-gray-600"
                                >
                                    システムとアカウントの設定を管理します
                                </motion.p>
                            </div>
                        </FadeIn>

                        {/* タブ */}
                        <SoftFadeIn delay={0.2}>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="space-y-6"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="profile"
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>プロフィール設定</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="export"
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>データエクスポート</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* プロフィール設定 */}
                                <TabsContent value="profile" className="space-y-6">
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <User className="w-5 h-5 text-purple-600" />
                                                <span>プロフィール情報</span>
                                            </CardTitle>
                                            <CardDescription>
                                                基本的な個人情報を管理します
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">

                                            {/* 基本情報 */}
                                            <form onSubmit={profileForm.handleSubmit(handleProfileSave)}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">名前</Label>
                                                        <Input
                                                            id="name"
                                                            {...profileForm.register('name')}
                                                            placeholder="管理者名を入力"
                                                            className={profileForm.formState.errors.name ? 'border-red-500' : ''}
                                                        />
                                                        {profileForm.formState.errors.name && (
                                                            <p className="text-sm text-red-500">
                                                                {profileForm.formState.errors.name.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">メールアドレス</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            {...profileForm.register('email')}
                                                            placeholder="メールアドレスを入力"
                                                            className={profileForm.formState.errors.email ? 'border-red-500' : ''}
                                                        />
                                                        {profileForm.formState.errors.email && (
                                                            <p className="text-sm text-red-500">
                                                                {profileForm.formState.errors.email.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end mt-6">
                                                    <Button
                                                        type="submit"
                                                        disabled={profileForm.formState.isSubmitting}
                                                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        {profileForm.formState.isSubmitting ? '保存中...' : '保存'}
                                                    </Button>
                                                </div>
                                            </form>

                                            {/* パスワード変更セクション */}
                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="font-medium text-gray-900 mb-4">パスワード変更</h4>
                                                <Dialog
                                                    open={isPasswordDialogOpen}
                                                    onOpenChange={setIsPasswordDialogOpen}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className='cursor-pointer'>
                                                            <Key className="w-4 h-4 mr-2" />
                                                            パスワードを変更
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className='w-[40vw]'>
                                                        <DialogHeader>
                                                            <DialogTitle>パスワード変更</DialogTitle>
                                                            <DialogDescription>
                                                                セキュリティのため、現在のパスワードと新しいパスワードを入力してください。
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <form id="password-form" onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="currentPassword">現在のパスワード</Label>
                                                                    <div className="relative">
                                                                        <Input
                                                                            id="currentPassword"
                                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                                            {...passwordForm.register('currentPassword')}
                                                                            className={`pr-10 ${passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}`}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                                        >
                                                                            {showCurrentPassword ? (
                                                                                <EyeOff className="h-4 w-4" />
                                                                            ) : (
                                                                                <Eye className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    {passwordForm.formState.errors.currentPassword && (
                                                                        <p className="text-sm text-red-500">
                                                                            {passwordForm.formState.errors.currentPassword.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="newPassword">新しいパスワード</Label>
                                                                    <div className="relative">
                                                                        <Input
                                                                            id="newPassword"
                                                                            type={showNewPassword ? 'text' : 'password'}
                                                                            {...passwordForm.register('newPassword')}
                                                                            className={`pr-10 ${passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}`}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                                                        >
                                                                            {showNewPassword ? (
                                                                                <EyeOff className="h-4 w-4" />
                                                                            ) : (
                                                                                <Eye className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                    {passwordForm.formState.errors.newPassword && (
                                                                        <p className="text-sm text-red-500">
                                                                            {passwordForm.formState.errors.newPassword.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
                                                                    <Input
                                                                        id="confirmPassword"
                                                                        type="password"
                                                                        {...passwordForm.register('confirmPassword')}
                                                                        className={passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
                                                                    />
                                                                    {passwordForm.formState.errors.confirmPassword && (
                                                                        <p className="text-sm text-red-500">
                                                                            {passwordForm.formState.errors.confirmPassword.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                className='cursor-pointer'
                                                                onClick={() => setIsPasswordDialogOpen(false)}
                                                            >
                                                                キャンセル
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                form="password-form"
                                                                disabled={passwordForm.formState.isSubmitting}
                                                                className='cursor-pointer'
                                                            >
                                                                {passwordForm.formState.isSubmitting ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        変更中...
                                                                    </>
                                                                ) : (
                                                                    'パスワード変更'
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* データエクスポート */}
                                <TabsContent value="export" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* 生徒データエクスポート */}
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <User className="w-5 h-5 text-purple-600" />
                                                    <span>生徒データ</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    生徒の基本情報と学習統計データ
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm text-gray-600">
                                                    生徒ID、名前、学年、登録日、学習時間、正答率などの情報をエクスポートします。
                                                </p>
                                                <DataExportDropdown
                                                    data={formatStudentsData()}
                                                    filename={`students_${new Date().toISOString().split('T')[0]}`}
                                                    sheetName="生徒データ"
                                                    className="w-full"
                                                    disabled={studentsLoading}
                                                />
                                                {studentsLoading && (
                                                    <p className="text-sm text-gray-500 text-center">
                                                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                                        データを読み込み中...
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* 単語データエクスポート */}
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <FileText className="w-5 h-5 text-purple-600" />
                                                    <span>単語データ</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    登録されている単語と統計情報
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm text-gray-600">
                                                    単語、意味、レベル、追加日、回答回数、正答率などの情報をエクスポートします。
                                                </p>
                                                <DataExportDropdown
                                                    data={formatWordsData()}
                                                    filename={`words_${new Date().toISOString().split('T')[0]}`}
                                                    sheetName="単語データ"
                                                    className="w-full"
                                                    disabled={wordsLoading}
                                                />
                                                {wordsLoading && (
                                                    <p className="text-sm text-gray-500 text-center">
                                                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                                        データを読み込み中...
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* 学習統計データエクスポート */}
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                                                    <span>学習統計</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    詳細な学習統計データ
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm text-gray-600">
                                                    生徒ごとの詳細な学習統計情報をエクスポートします。
                                                </p>
                                                <DataExportDropdown
                                                    data={statisticsData}
                                                    filename={`statistics_${new Date().toISOString().split('T')[0]}`}
                                                    sheetName="学習統計"
                                                    className="w-full"
                                                    disabled={isLoadingStats}
                                                />
                                                {isLoadingStats && (
                                                    <p className="text-sm text-gray-500 text-center">
                                                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                                                        データを読み込み中...
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* エクスポート情報 */}
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <Download className="w-5 h-5 text-purple-600" />
                                                <span>エクスポートについて</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">CSV形式</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        <li>• Excel、Googleスプレッドシートで開けます</li>
                                                        <li>• 文字コードはUTF-8です</li>
                                                        <li>• 軽量で高速にダウンロードできます</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Excel形式</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        <li>• .xlsx形式でダウンロードされます</li>
                                                        <li>• Excelで直接開くことができます</li>
                                                        <li>• 表計算やグラフ作成に適しています</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </SoftFadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
