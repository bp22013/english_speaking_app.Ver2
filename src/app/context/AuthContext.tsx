/* 生徒の認証・ルート保護・セッション情報取得用コンテキスト */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { client } from '@/lib/HonoClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Student = {
    studentId: string;
    name: string;
    grade: string | null;
    sessionId: string | null;
};

type AuthContextType = {
    user: Student | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await client.api.auth.useSession.$get();
                const data = await res.json();

                if (data.flg && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                    toast.error('セッションが有効ではありません\n再度ログインしてください', {
                        id: 'invalid-session',
                    });
                    router.push('/');
                }
            } catch (err) {
                setUser(null);
                toast.error('セッション取得に失敗しました', {
                    id: 'session-fetch-failed',
                });
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
