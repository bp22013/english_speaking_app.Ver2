/* 管理者側の情報を保持するコンテキスト */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { client } from '@/lib/HonoClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Admin = {
    id: string;
    name: string;
    email?: string;
};

type AuthContextType = {
    user: Admin | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await client.api.auth.getAdminSession.$get();
                const data = await res.json();

                if (data.flg && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                    toast.error('セッションが有効ではありません\n再度ログインしてください', {
                        id: 'invalid-admin-session',
                    });
                    router.push('/');
                }
            } catch (error) {
                setUser(null);
                toast.error(`セッション取得に失敗しました: ${error}`, {
                    id: 'admin-session-fetch-failed',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [router]);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAdminSession = () => useContext(AuthContext);
