'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/SupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminPasswordResetConfirm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

    // URLパラメータからトークンを取得
    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
            // トークンがない場合はログイン画面にリダイレクト
            router.replace('/');
            toast.error('トークンが有効ではありません');
            return;
        }

        // トークンがある場合はセッションを設定
        const setSessionAsync = async () => {
            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (error) {
                toast.error(`セッション設定エラー: ${error}`);
                router.replace('/');
            }
        };

        setSessionAsync();
    }, [searchParams, router]);

    // パスワード強度チェック
    const validatePassword = (password: string) => {
        const errors: { [key: string]: string } = {};

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.password = 'パスワードは大文字、小文字、数字を含む必要があります';
        }

        if (confirmPassword && password !== confirmPassword) {
            errors.confirmPassword = 'パスワードが一致しません';
        }

        return errors;
    };

    // 入力時のリアルタイムバリデーション
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setError('');

        const errors = validatePassword(value);
        setValidationErrors((prev) => ({ ...prev, ...errors }));
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setError('');

        if (password && value !== password) {
            setValidationErrors((prev) => ({
                ...prev,
                confirmPassword: 'パスワードが一致しません',
            }));
        } else {
            setValidationErrors((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { confirmPassword, ...rest } = prev;
                return rest;
            });
        }
    };

    // パスワード更新処理
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validatePassword(password);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                throw error;
            }

            setIsSuccess(true);

            // 3秒後にログイン画面にリダイレクト
            setTimeout(() => {
                router.push('/admin/login');
            }, 3000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Password update error:', err);

            if (err.message?.includes('Invalid token')) {
                setError(
                    'リセットリンクが無効または期限切れです。新しいリセットリンクを取得してください。'
                );
            } else if (err.message?.includes('Password should be')) {
                setError('パスワードの要件を満たしていません。');
            } else {
                setError(
                    'パスワードの更新に失敗しました。しばらく時間をおいてから再試行してください。'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 成功画面
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                パスワード更新完了
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                新しいパスワードが設定されました
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                パスワードが正常に更新されました。新しいパスワードでログインできます。
                            </AlertDescription>
                        </Alert>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                3秒後に自動的にログイン画面に移動します...
                            </p>
                            <Button
                                onClick={() => router.push('/admin/login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                今すぐログイン画面へ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // メイン画面
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            新しいパスワード設定
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            管理者アカウントの新しいパスワードを入力してください
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                新しいパスワード
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="新しいパスワードを入力"
                                    className={`pr-10 transition-colors ${
                                        validationErrors.password
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-700"
                            >
                                パスワード確認
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="パスワードを再入力"
                                    className={`pr-10 transition-colors ${
                                        validationErrors.confirmPassword
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-800">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">パスワード要件：</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    8文字以上
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    大文字、小文字、数字を含む
                                </li>
                                <li className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}
                                    />
                                    パスワードが一致
                                </li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={
                                isLoading ||
                                Object.keys(validationErrors).length > 0 ||
                                !password ||
                                !confirmPassword
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    更新中...
                                </>
                            ) : (
                                'パスワードを更新'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
