/* 管理者のログイン・ログアウト処理用サーバーアクション */

'use server';

import { createClient } from './server';
import { AdminLoginFormData } from '@/lib/validation';

export const login = async (data: AdminLoginFormData) => {
    const supabase = await createClient();
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.adminPassword,
        });

        if (error) {
            if (error.message === 'Invalid login credentials') {
                return {
                    success: false,
                    error: 'メールアドレスまたはパスワードが違います',
                };
            }
            return {
                success: false,
                error: `ログインエラー: ${error.message}`,
            };
        }

        // セッション情報を取得
        await supabase.auth.getSession();

        return {
            success: true,
            message: 'ログインしました!',
        };
    } catch (error) {
        return {
            success: false,
            error: `不明なエラーが発生しました: ${error}`,
        };
    }
};

export const logout = async () => {
    const supabase = await createClient();
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return {
                success: false,
                error: 'ログアウト中にエラーが発生しました',
            };
        }

        return {
            success: true,
            message: 'ログアウトしました!',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: '不明なエラーが発生しました',
        };
    }
};
