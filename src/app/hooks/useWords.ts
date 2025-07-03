/* 単語の情報をSWRで取得するフック */

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export const useWords = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/word/getWords', fetcher);

    return {
        words: data?.data ?? [],
        isLoading,
        isError: error,
        refetch: () => mutate(undefined, { revalidate: true }),
    };
};
