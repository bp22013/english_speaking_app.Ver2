'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Save, Camera } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { StudentNavigation } from '../../components/StudentNavigationBar';
import { PasswordChangeDialog } from '../../components/StudentPassChangeModal';
import { PageTransition, FadeIn, SoftFadeIn } from '../../components/page-transition';
import { motion } from 'framer-motion';
import Loading from '@/app/loading';

export default function SettingsPage() {
    const { loading } = useAuth();

    const [profile, setProfile] = useState({
        name: '田中太郎',
        email: 'tanaka@example.com',
        grade: '高校2年生',
        bio: '英語を頑張って勉強しています！',
    });

    const handleSave = () => {
        console.log('Settings saved');
    };

    function handlePasswordChange(currentPassword: string, newPassword: string): Promise<void> {
        throw new Error('Function not implemented.');
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-y-scroll">
            <StudentNavigation />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6 p-6 mb-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-3xl font-bold text-gray-900 mb-2"
                                >
                                    設定
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-gray-600"
                                >
                                    アカウントと学習設定をカスタマイズしましょう
                                </motion.p>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* プロフィール設定 */}
                            <div className="lg:col-span-2 space-y-6">
                                <SoftFadeIn delay={0.2}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-2">
                                                <User className="w-5 h-5 text-blue-600" />
                                                <span>プロフィール</span>
                                            </CardTitle>
                                            <CardDescription>
                                                基本的な個人情報を管理します
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* アバター */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.6 }}
                                                className="flex items-center space-x-4"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    <Avatar className="w-20 h-20">
                                                        <AvatarImage
                                                            src="/placeholder.svg?height=80&width=80"
                                                            alt="Profile"
                                                        />
                                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                                                            田中
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </motion.div>
                                                <div>
                                                    <motion.div
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            <Camera className="w-4 h-4 mr-2" />
                                                            写真を変更
                                                        </Button>
                                                    </motion.div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        JPG、PNG形式（最大2MB）
                                                    </p>
                                                </div>
                                            </motion.div>

                                            {/* 基本情報 */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.6 }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">名前</Label>
                                                    <Input
                                                        id="name"
                                                        value={profile.name}
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">生徒ID</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={profile.email}
                                                        onChange={(e) =>
                                                            setProfile({
                                                                ...profile,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6, duration: 0.6 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="grade">学年</Label>
                                                <Select
                                                    value={profile.grade}
                                                    onValueChange={(value) =>
                                                        setProfile({ ...profile, grade: value })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="中学1年生">
                                                            中学1年生
                                                        </SelectItem>
                                                        <SelectItem value="中学2年生">
                                                            中学2年生
                                                        </SelectItem>
                                                        <SelectItem value="中学3年生">
                                                            中学3年生
                                                        </SelectItem>
                                                        <SelectItem value="高校1年生">
                                                            高校1年生
                                                        </SelectItem>
                                                        <SelectItem value="高校2年生">
                                                            高校2年生
                                                        </SelectItem>
                                                        <SelectItem value="高校3年生">
                                                            高校3年生
                                                        </SelectItem>
                                                        <SelectItem value="大学生">
                                                            大学生
                                                        </SelectItem>
                                                        <SelectItem value="社会人">
                                                            社会人
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7, duration: 0.6 }}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor="bio">自己紹介</Label>
                                                <Textarea
                                                    id="bio"
                                                    placeholder="自己紹介を入力してください..."
                                                    value={profile.bio}
                                                    onChange={(e) =>
                                                        setProfile({
                                                            ...profile,
                                                            bio: e.target.value,
                                                        })
                                                    }
                                                    rows={3}
                                                />
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </SoftFadeIn>
                            </div>

                            {/* サイドバー */}
                            <div className="space-y-4.5">
                                <SoftFadeIn delay={0.5}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                アカウント情報
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7, duration: 0.6 }}
                                            >
                                                <p className="text-sm text-gray-600">登録日</p>
                                                <p className="font-medium">2024年11月15日</p>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.8, duration: 0.6 }}
                                            >
                                                <p className="text-sm text-gray-600">
                                                    最終ログイン
                                                </p>
                                                <p className="font-medium">2024年12月6日</p>
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </SoftFadeIn>

                                <SoftFadeIn delay={0.6}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                アカウント管理
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <PasswordChangeDialog
                                                onPasswordChange={handlePasswordChange}
                                            />
                                            {[
                                                {
                                                    icon: LogOut,
                                                    label: 'ログアウト',
                                                    variant: 'destructive' as const,
                                                },
                                            ].map((action, index) => {
                                                const Icon = action.icon;
                                                return (
                                                    <motion.div
                                                        key={action.label}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            delay: 0.9 + index * 0.1,
                                                            duration: 0.6,
                                                        }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <Button
                                                            variant={action.variant}
                                                            className="w-full justify-start cursor-pointer"
                                                        >
                                                            <Icon className="w-4 h-4 mr-2" />
                                                            {action.label}
                                                        </Button>
                                                    </motion.div>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                </SoftFadeIn>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.6 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleSave}
                                        className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        設定を保存
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
