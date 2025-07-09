/* 生徒のメッセージを取得するフック */

/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { StudentMessage } from '@/types/message';

export const useStudentMessages = (): {
    messages: StudentMessage[];
    isLoading: boolean;
    isError: any;
    refetch: () => void;
} => {
    const { data, error, isLoading, mutate } = useSWR('/api/messages/getStudentMessages', fetcher);

    return {
        messages: (data?.messages ?? []) as StudentMessage[],
        isLoading,
        isError: error,
        refetch: mutate,
    };
};
