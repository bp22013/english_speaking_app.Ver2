'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BookOpen,
    GraduationCap,
    Shield,
    User,
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/SupabaseClient';
import toast from 'react-hot-toast';
import { client } from '@/lib/HonoClient';
import { resolve } from 'path';
import { rejects } from 'assert';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [email, setEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [activeTab, setActiveTab] = useState('student');
    const [showStudentPassword, setStudentShowPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    const router = useRouter();

    const adminHandleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const { error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: adminPassword,
                    });

                    if (error) {
                        reject(`ログイン中にエラーが発生しました: ${error}`);
                    } else {
                        resolve('ログインしました!');
                        router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/dashboard`);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: 'ログインしています...',
                success: 'ログインしました!',
                error: (message: string) => message,
            }
        );
    };

    const studentHandleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.auth.studentLogin.$post({
                        form: {
                            body: { studentId, password: studentPassword },
                        },
                    });

                    const data = await res.json();

                    if (data.flg) {
                        resolve(data.message);
                        router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/student/dashboard`);
                    } else {
                        reject(data.error);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: 'ログインしています...',
                success: 'ログインしました!',
                error: (message: string) => message,
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                        VocabMaster
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">英単語学習プラットフォーム</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-10">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            ログイン
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            アカウントにログインして学習の旅を始めましょう
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/50 p-1 rounded-xl h-14">
                                <TabsTrigger
                                    value="student"
                                    className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 px-4 transition-all duration-200 text-sm font-medium cursor-pointer"
                                >
                                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                                    <span>生徒</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="admin"
                                    className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2 px-4 transition-all duration-200 text-sm font-medium cursor-pointer"
                                >
                                    <Shield className="w-4 h-4 flex-shrink-0" />
                                    <span>管理者</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="student" className="space-y-6">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                                        <GraduationCap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">生徒ログイン</h3>
                                </div>

                                <form onSubmit={studentHandleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="student-studentId"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            生徒ID
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                autoFocus
                                                id="student-studentId"
                                                disabled={isLoading}
                                                type="text"
                                                placeholder="生徒IDを入力"
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                required
                                                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="student-password"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                パスワード
                                            </Label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            >
                                                パスワードを忘れた場合
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="student-password"
                                                type={showStudentPassword ? 'text' : 'password'}
                                                disabled={isLoading}
                                                placeholder="パスワードを入力"
                                                value={studentPassword}
                                                onChange={(e) => setStudentPassword(e.target.value)}
                                                required
                                                className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={isLoading}
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                onClick={() =>
                                                    setStudentShowPassword(!showStudentPassword)
                                                }
                                            >
                                                {showStudentPassword ? (
                                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        生徒としてログイン
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="admin" className="space-y-6">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                                        <Shield className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">管理者ログイン</h3>
                                </div>

                                <form onSubmit={adminHandleLogin} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="admin-email"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            管理者メールアドレス
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="admin-email"
                                                type="email"
                                                disabled={isLoading}
                                                placeholder="admin@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="admin-password"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                管理者パスワード
                                            </Label>
                                            <Link
                                                href="/admin/forgot-password"
                                                className="text-sm text-purple-600 hover:text-purple-800 hover:underline font-medium"
                                            >
                                                パスワードを忘れた場合
                                            </Link>
                                        </div>

                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="admin-password"
                                                type={showAdminPassword ? 'text' : 'password'}
                                                disabled={isLoading}
                                                placeholder="管理者パスワードを入力"
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                required
                                                className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={isLoading}
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                                onClick={() =>
                                                    setShowAdminPassword(!showAdminPassword)
                                                }
                                            >
                                                {showAdminPassword ? (
                                                    <EyeOff className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        管理者としてログイン
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
