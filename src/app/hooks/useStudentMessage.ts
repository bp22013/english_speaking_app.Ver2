/* 生徒のメッセージを取得するフック */

/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import type { StudentMessage } from '@/types/message';

interface GetStudentMessagesResponse {
    flg: boolean;
    messages: StudentMessage[];
    adminName: string | null;
}

export const useStudentMessages = (): {
    messages: StudentMessage[];
    adminName: string | null;
    isLoading: boolean;
    isError: any;
    refetch: () => void;
} => {
    const { data, error, isLoading, mutate } = useSWR<GetStudentMessagesResponse>(
        '/api/messages/getStudentMessages',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 0,
            dedupingInterval: 10000, // 10秒間は重複リクエストを防ぐ
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            onError: (error) => {
                console.error('メッセージ取得エラー:', error);
            },
            onSuccess: (data) => {
                console.log('メッセージ取得成功:', data);
            },
        }
    );

    return {
        messages: data?.messages ?? [],
        adminName: data?.adminName ?? null,
        isLoading,
        isError: error,
        refetch: mutate,
    };
};
