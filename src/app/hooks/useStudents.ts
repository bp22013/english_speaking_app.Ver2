/* 生徒の情報をSWRで取得するフック */

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const useStudents = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/auth/getStudentInfo', fetcher);

    return {
        students: data?.sessions ?? [],
        isLoading,
        isError: error,
        refetch: mutate,
    };
};
