/* 生徒側のセッションをチェックするフック */

'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/HonoClient';
import toast from 'react-hot-toast';

export const useSession = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await client.api.auth.useSession.$get();
                const data = await res.json();

                const authenticated = !!data?.user;
                setIsAuthenticated(authenticated);

                if (!data.flg) {
                    toast.error('セッションが有効ではありません\n再度ログインしてください', {
                        id: 'invalid-session',
                    });
                }

                return authenticated;
            } catch (error: any) {
                setError(error);
                toast.error('セッション取得に失敗しました', {
                    id: 'session-fetch-error',
                });
                return false;
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return { isAuthenticated, loading, error };
};
