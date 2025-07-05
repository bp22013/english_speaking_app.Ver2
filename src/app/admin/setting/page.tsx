'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
    Settings,
    User,
    Shield,
    Bell,
    Database,
    Palette,
    Globe,
    Save,
    Camera,
    Key,
    Download,
    Upload,
    Trash2,
    AlertTriangle,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // プロフィール設定
    const [profileData, setProfileData] = useState({
        name: '山田先生',
        email: 'yamada@school.edu',
        phone: '090-1234-5678',
        department: '英語科',
        bio: '英語教育に20年間携わっています。生徒の学習をサポートすることが私の使命です。',
    });

    // システム設定
    const [systemSettings, setSystemSettings] = useState({
        siteName: 'VocabMaster',
        siteDescription: '英単語学習プラットフォーム',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        maxStudentsPerClass: 50,
        sessionTimeout: 30,
        backupFrequency: 'daily',
    });

    // 通知設定
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        newStudentRegistration: true,
        systemAlerts: true,
        weeklyReports: true,
        maintenanceAlerts: true,
        securityAlerts: true,
    });

    // テーマ設定
    const [themeSettings, setThemeSettings] = useState({
        primaryColor: 'purple',
        darkMode: false,
        compactMode: false,
        animationsEnabled: true,
    });

    // パスワード変更
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileSave = async () => {
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('プロフィールを更新しました\n変更内容が保存されました。');
        } catch (error) {
            toast.error('エラーが発生しました\nプロフィールの更新に失敗しました。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSystemSave = async () => {
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('システム設定を更新しました\n変更内容が保存されました。');
        } catch (error) {
            toast.error('エラーが発生しました\nシステム設定の更新に失敗しました。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(
                'パスワードが一致しません\n新しいパスワードと確認用パスワードが一致しません。'
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('パスワードを変更しました\n新しいパスワードが設定されました。');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setIsPasswordDialogOpen(false);
        } catch (error) {
            toast.error(
                'パスワード変更に失敗しました\n現在のパスワードが正しいか確認してください。'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackup = async () => {
        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success(
                'バックアップが完了しました\nデータのバックアップが正常に作成されました。'
            );
            setIsBackupDialogOpen(false);
        } catch (error) {
            toast.error(
                'バックアップに失敗しました\nデータのバックアップ作成中にエラーが発生しました。'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger
                                        value="profile"
                                        className="flex items-center space-x-2"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="hidden sm:inline">プロフィール</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="system"
                                        className="flex items-center space-x-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="hidden sm:inline">システム</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="notifications"
                                        className="flex items-center space-x-2"
                                    >
                                        <Bell className="w-4 h-4" />
                                        <span className="hidden sm:inline">通知</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="appearance"
                                        className="flex items-center space-x-2"
                                    >
                                        <Palette className="w-4 h-4" />
                                        <span className="hidden sm:inline">外観</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="security"
                                        className="flex items-center space-x-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span className="hidden sm:inline">セキュリティ</span>
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
                                            {/* アバター */}
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="w-20 h-20">
                                                    <AvatarImage
                                                        src="/placeholder.svg?height=80&width=80"
                                                        alt="Profile"
                                                    />
                                                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xl">
                                                        山田
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Button variant="outline" size="sm">
                                                        <Camera className="w-4 h-4 mr-2" />
                                                        写真を変更
                                                    </Button>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        JPG、PNG形式（最大2MB）
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 基本情報 */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">名前</Label>
                                                    <Input
                                                        id="name"
                                                        value={profileData.name}
                                                        onChange={(e) =>
                                                            setProfileData({
                                                                ...profileData,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">メールアドレス</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profileData.email}
                                                        onChange={(e) =>
                                                            setProfileData({
                                                                ...profileData,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">電話番号</Label>
                                                    <Input
                                                        id="phone"
                                                        value={profileData.phone}
                                                        onChange={(e) =>
                                                            setProfileData({
                                                                ...profileData,
                                                                phone: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="department">所属</Label>
                                                    <Input
                                                        id="department"
                                                        value={profileData.department}
                                                        onChange={(e) =>
                                                            setProfileData({
                                                                ...profileData,
                                                                department: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">自己紹介</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={profileData.bio}
                                                    onChange={(e) =>
                                                        setProfileData({
                                                            ...profileData,
                                                            bio: e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleProfileSave}
                                                    disabled={isSubmitting}
                                                    className="bg-purple-600 hover:bg-purple-700"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {isSubmitting ? '保存中...' : '保存'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* システム設定 */}
                                <TabsContent value="system" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Globe className="w-5 h-5 text-purple-600" />
                                                    <span>サイト設定</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    サイトの基本情報を設定します
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="siteName">サイト名</Label>
                                                    <Input
                                                        id="siteName"
                                                        value={systemSettings.siteName}
                                                        onChange={(e) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                siteName: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="siteDescription">
                                                        サイト説明
                                                    </Label>
                                                    <Textarea
                                                        id="siteDescription"
                                                        value={systemSettings.siteDescription}
                                                        onChange={(e) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                siteDescription: e.target.value,
                                                            })
                                                        }
                                                        rows={2}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Settings className="w-5 h-5 text-purple-600" />
                                                    <span>システム制御</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    システムの動作を制御します
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>メンテナンスモード</Label>
                                                        <p className="text-sm text-gray-500">
                                                            サイトを一時的に停止します
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={systemSettings.maintenanceMode}
                                                        onCheckedChange={(checked) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                maintenanceMode: checked,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>新規登録許可</Label>
                                                        <p className="text-sm text-gray-500">
                                                            新しい生徒の登録を許可します
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={systemSettings.registrationEnabled}
                                                        onCheckedChange={(checked) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                registrationEnabled: checked,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>メール認証必須</Label>
                                                        <p className="text-sm text-gray-500">
                                                            登録時にメール認証を必須にします
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={
                                                            systemSettings.emailVerificationRequired
                                                        }
                                                        onCheckedChange={(checked) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                emailVerificationRequired: checked,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Database className="w-5 h-5 text-purple-600" />
                                                    <span>制限設定</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    システムの制限値を設定します
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="maxStudents">
                                                        クラス最大生徒数
                                                    </Label>
                                                    <Input
                                                        id="maxStudents"
                                                        type="number"
                                                        value={systemSettings.maxStudentsPerClass}
                                                        onChange={(e) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                maxStudentsPerClass:
                                                                    Number.parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="sessionTimeout">
                                                        セッションタイムアウト（分）
                                                    </Label>
                                                    <Input
                                                        id="sessionTimeout"
                                                        type="number"
                                                        value={systemSettings.sessionTimeout}
                                                        onChange={(e) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                sessionTimeout: Number.parseInt(
                                                                    e.target.value
                                                                ),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="backupFrequency">
                                                        バックアップ頻度
                                                    </Label>
                                                    <Select
                                                        value={systemSettings.backupFrequency}
                                                        onValueChange={(value) =>
                                                            setSystemSettings({
                                                                ...systemSettings,
                                                                backupFrequency: value,
                                                            })
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="hourly">
                                                                毎時
                                                            </SelectItem>
                                                            <SelectItem value="daily">
                                                                毎日
                                                            </SelectItem>
                                                            <SelectItem value="weekly">
                                                                毎週
                                                            </SelectItem>
                                                            <SelectItem value="monthly">
                                                                毎月
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Database className="w-5 h-5 text-purple-600" />
                                                    <span>データ管理</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    データのバックアップと復元
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex flex-col space-y-2">
                                                    <Dialog
                                                        open={isBackupDialogOpen}
                                                        onOpenChange={setIsBackupDialogOpen}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full"
                                                            >
                                                                <Download className="w-4 h-4 mr-2" />
                                                                データをバックアップ
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    データバックアップ
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    システムの全データをバックアップします。この処理には時間がかかる場合があります。
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        setIsBackupDialogOpen(false)
                                                                    }
                                                                >
                                                                    キャンセル
                                                                </Button>
                                                                <Button
                                                                    onClick={handleBackup}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    {isSubmitting ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                            バックアップ中...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Download className="mr-2 h-4 w-4" />
                                                                            バックアップ開始
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button variant="outline" className="w-full">
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        データを復元
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleSystemSave}
                                            disabled={isSubmitting}
                                            className="bg-purple-600 hover:bg-purple-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSubmitting ? '保存中...' : '設定を保存'}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* 通知設定 */}
                                <TabsContent value="notifications" className="space-y-6">
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <Bell className="w-5 h-5 text-purple-600" />
                                                <span>通知設定</span>
                                            </CardTitle>
                                            <CardDescription>
                                                受け取りたい通知を選択してください
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                {[
                                                    {
                                                        key: 'emailNotifications',
                                                        label: 'メール通知',
                                                        desc: '重要な通知をメールで受け取ります',
                                                    },
                                                    {
                                                        key: 'newStudentRegistration',
                                                        label: '新規生徒登録通知',
                                                        desc: '新しい生徒が登録された時に通知します',
                                                    },
                                                    {
                                                        key: 'systemAlerts',
                                                        label: 'システムアラート',
                                                        desc: 'システムエラーや異常を通知します',
                                                    },
                                                    {
                                                        key: 'weeklyReports',
                                                        label: '週間レポート',
                                                        desc: '週ごとの活動レポートを送信します',
                                                    },
                                                    {
                                                        key: 'maintenanceAlerts',
                                                        label: 'メンテナンス通知',
                                                        desc: '予定されたメンテナンスを事前に通知します',
                                                    },
                                                    {
                                                        key: 'securityAlerts',
                                                        label: 'セキュリティアラート',
                                                        desc: '不審なアクセスやセキュリティ問題を通知します',
                                                    },
                                                ].map((notification) => (
                                                    <div
                                                        key={notification.key}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <Label>{notification.label}</Label>
                                                            <p className="text-sm text-gray-500">
                                                                {notification.desc}
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={
                                                                notificationSettings[
                                                                    notification.key as keyof typeof notificationSettings
                                                                ]
                                                            }
                                                            onCheckedChange={(checked) =>
                                                                setNotificationSettings({
                                                                    ...notificationSettings,
                                                                    [notification.key]: checked,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* 外観設定 */}
                                <TabsContent value="appearance" className="space-y-6">
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <Palette className="w-5 h-5 text-purple-600" />
                                                <span>外観設定</span>
                                            </CardTitle>
                                            <CardDescription>
                                                インターフェースの外観をカスタマイズします
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>プライマリカラー</Label>
                                                    <div className="flex space-x-2">
                                                        {[
                                                            'purple',
                                                            'blue',
                                                            'green',
                                                            'red',
                                                            'yellow',
                                                        ].map((color) => (
                                                            <button
                                                                key={color}
                                                                onClick={() =>
                                                                    setThemeSettings({
                                                                        ...themeSettings,
                                                                        primaryColor: color,
                                                                    })
                                                                }
                                                                className={`w-8 h-8 rounded-full bg-${color}-600 ${
                                                                    themeSettings.primaryColor ===
                                                                    color
                                                                        ? 'ring-2 ring-offset-2 ring-gray-400'
                                                                        : ''
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>ダークモード</Label>
                                                        <p className="text-sm text-gray-500">
                                                            暗いテーマを使用します
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={themeSettings.darkMode}
                                                        onCheckedChange={(checked) =>
                                                            setThemeSettings({
                                                                ...themeSettings,
                                                                darkMode: checked,
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>コンパクトモード</Label>
                                                        <p className="text-sm text-gray-500">
                                                            より密度の高いレイアウトを使用します
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={themeSettings.compactMode}
                                                        onCheckedChange={(checked) =>
                                                            setThemeSettings({
                                                                ...themeSettings,
                                                                compactMode: checked,
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label>アニメーション</Label>
                                                        <p className="text-sm text-gray-500">
                                                            画面遷移やホバー効果を有効にします
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={themeSettings.animationsEnabled}
                                                        onCheckedChange={(checked) =>
                                                            setThemeSettings({
                                                                ...themeSettings,
                                                                animationsEnabled: checked,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* セキュリティ設定 */}
                                <TabsContent value="security" className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Key className="w-5 h-5 text-purple-600" />
                                                    <span>パスワード</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    アカウントのパスワードを変更します
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Dialog
                                                    open={isPasswordDialogOpen}
                                                    onOpenChange={setIsPasswordDialogOpen}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full"
                                                        >
                                                            <Shield className="w-4 h-4 mr-2" />
                                                            パスワードを変更
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                パスワード変更
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                セキュリティのため、現在のパスワードと新しいパスワードを入力してください。
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="currentPassword">
                                                                    現在のパスワード
                                                                </Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id="currentPassword"
                                                                        type={
                                                                            showCurrentPassword
                                                                                ? 'text'
                                                                                : 'password'
                                                                        }
                                                                        value={
                                                                            passwordData.currentPassword
                                                                        }
                                                                        onChange={(e) =>
                                                                            setPasswordData({
                                                                                ...passwordData,
                                                                                currentPassword:
                                                                                    e.target.value,
                                                                            })
                                                                        }
                                                                        className="pr-10"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setShowCurrentPassword(
                                                                                !showCurrentPassword
                                                                            )
                                                                        }
                                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
                                                                <Label htmlFor="newPassword">
                                                                    新しいパスワード
                                                                </Label>
                                                                <div className="relative">
                                                                    <Input
                                                                        id="newPassword"
                                                                        type={
                                                                            showNewPassword
                                                                                ? 'text'
                                                                                : 'password'
                                                                        }
                                                                        value={
                                                                            passwordData.newPassword
                                                                        }
                                                                        onChange={(e) =>
                                                                            setPasswordData({
                                                                                ...passwordData,
                                                                                newPassword:
                                                                                    e.target.value,
                                                                            })
                                                                        }
                                                                        className="pr-10"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setShowNewPassword(
                                                                                !showNewPassword
                                                                            )
                                                                        }
                                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                                    >
                                                                        {showNewPassword ? (
                                                                            <EyeOff className="h-4 w-4" />
                                                                        ) : (
                                                                            <Eye className="h-4 w-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="confirmPassword">
                                                                    新しいパスワード（確認）
                                                                </Label>
                                                                <Input
                                                                    id="confirmPassword"
                                                                    type="password"
                                                                    value={
                                                                        passwordData.confirmPassword
                                                                    }
                                                                    onChange={(e) =>
                                                                        setPasswordData({
                                                                            ...passwordData,
                                                                            confirmPassword:
                                                                                e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setIsPasswordDialogOpen(false)
                                                                }
                                                            >
                                                                キャンセル
                                                            </Button>
                                                            <Button
                                                                onClick={handlePasswordChange}
                                                                disabled={isSubmitting}
                                                            >
                                                                {isSubmitting ? (
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
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Shield className="w-5 h-5 text-purple-600" />
                                                    <span>セキュリティ情報</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    アカウントのセキュリティ状況
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        最終ログイン:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        2024年1月15日 14:30
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        パスワード最終変更:
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        2024年1月1日
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        二段階認証:
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-red-50 text-red-700"
                                                    >
                                                        未設定
                                                    </Badge>
                                                </div>
                                                <div className="pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                    >
                                                        二段階認証を設定
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                                <span>危険な操作</span>
                                            </CardTitle>
                                            <CardDescription>注意が必要な操作です</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <div className="flex items-center mb-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                                    <h4 className="font-medium text-red-800">
                                                        アカウント削除
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-red-700 mb-3">
                                                    アカウントを削除すると、すべてのデータが永久に失われます。この操作は取り消せません。
                                                </p>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    アカウントを削除
                                                </Button>
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
