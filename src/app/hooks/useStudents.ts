/* 生徒の情報をSWRで取得するフック */

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useAdminSession } from '@/app/context/AdminAuthContext';

export const useStudents = () => {
    const { user } = useAdminSession();
    const shouldFetch = !!user?.id;

    // 🔍 ログポイント①：user と fetch 条件
    console.log('🔍 useStudents - user:', user);
    console.log('🔍 useStudents - shouldFetch:', shouldFetch);

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? '/api/auth/getStudentInfo' : null,
        fetcher
    );

    // 🔍 ログポイント②：取得されたデータ
    console.log('🔍 useStudents - data:', data);

    return {
        students: data?.sessions ?? [],
        isLoading,
        isError: error,
        refetch: mutate,
    };
};
