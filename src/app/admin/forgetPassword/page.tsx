'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/SupabaseClient';

export default function AdminPasswordReset() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [validationError, setValidationError] = useState('');

    // メールアドレスのバリデーション
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 入力時のリアルタイムバリデーション
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setError('');

        if (value && !validateEmail(value)) {
            setValidationError('正しいメールアドレスを入力してください');
        } else {
            setValidationError('');
        }
    };

    // パスワードリセット処理
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setValidationError('メールアドレスを入力してください');
            return;
        }

        if (!validateEmail(email)) {
            setValidationError('正しいメールアドレスを入力してください');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password-confirm`,
            });

            if (error) {
                throw error;
            }

            setIsSuccess(true);
        } catch (err: any) {
            console.error('Password reset error:', err);

            // エラーメッセージの日本語化
            if (err.message?.includes('Email not confirmed')) {
                setError('このメールアドレスは確認されていません。管理者にお問い合わせください。');
            } else if (err.message?.includes('Invalid email')) {
                setError('無効なメールアドレスです。');
            } else if (err.message?.includes('Too many requests')) {
                setError('リクエストが多すぎます。しばらく時間をおいてから再試行してください。');
            } else {
                setError(
                    'パスワードリセットメールの送信に失敗しました。しばらく時間をおいてから再試行してください。'
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
                                メール送信完了
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                パスワードリセットの手順をお送りしました
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Alert className="border-green-200 bg-green-50">
                            <Mail className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                <strong>{email}</strong>{' '}
                                にパスワードリセットのリンクを送信しました。
                                メールをご確認いただき、リンクをクリックして新しいパスワードを設定してください。
                            </AlertDescription>
                        </Alert>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">次の手順：</h4>
                            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>メールボックスを確認してください</li>
                                <li>「パスワードリセット」のメールを開いてください</li>
                                <li>メール内のリンクをクリックしてください</li>
                                <li>新しいパスワードを設定してください</li>
                            </ol>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            <p>メールが届かない場合は、迷惑メールフォルダもご確認ください。</p>
                            <p className="mt-2">
                                5分経ってもメールが届かない場合は、
                                <button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setEmail('');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                                >
                                    再度お試しください
                                </button>
                            </p>
                        </div>

                        <div className="pt-4 border-t">
                            <Link href="/admin/login">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    ログイン画面に戻る
                                </Button>
                            </Link>
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
                            パスワードリセット
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            管理者アカウントのパスワードを再設定します
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                メールアドレス
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="admin@example.com"
                                className={`transition-colors ${
                                    validationError
                                        ? 'border-red-300 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                }`}
                                disabled={isLoading}
                            />
                            {validationError && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationError}
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

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-semibold mb-1">ご注意</p>
                                    <p>
                                        登録されているメールアドレスにパスワードリセットのリンクを送信します。
                                        管理者アカウントでのみご利用いただけます。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading || !!validationError || !email}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    送信中...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4 mr-2" />
                                    リセットメールを送信
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <Link href="/admin/login">
                                <Button
                                    variant="ghost"
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    ログイン画面に戻る
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
