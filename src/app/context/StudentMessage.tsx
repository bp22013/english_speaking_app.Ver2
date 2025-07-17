/* 生徒のメッセージ用コンテキスト */

'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useStudentMessages } from '@/app/hooks/useStudentMessage';
import type { StudentMessage } from '@/types/message';
import { client } from '@/lib/HonoClient';
import toast from 'react-hot-toast';

interface StudentMessagesContextType {
    messages: StudentMessage[];
    adminName: string | null;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError: any;
    refetch: () => void;
    markAsRead: (messageId: string, studentId: string) => Promise<void>;
    deleteMessage: (messageIds: string, senderId: string, studentId: string) => Promise<void>;
}

const StudentMessagesContext = createContext<StudentMessagesContextType | undefined>(undefined);

export const StudentMessagesProvider = ({ children }: { children: ReactNode }) => {
    const { messages, adminName, isLoading, isError, refetch } = useStudentMessages();

    // メッセージを既読にする
    const markAsRead = useCallback(
        async (messageId: string, studentId: string) => {
            try {
                const res = await client.api.messages.markAsRead.$post({
                    json: { id: messageId, studentId },
                });

                const data = await res.json();

                if (data.flg) {
                    await refetch();
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('既読化エラー:', error);
            }
        },
        [refetch]
    );

    // メッセージを削除する
    const deleteMessage = useCallback(
        async (messageIds: string, senderId: string, studentId: string) => {
            toast.promise(
                new Promise(async (resolve, reject) => {
                    try {
                        const res = await client.api.messages.deleteMessage.$post({
                            json: { messageIds, senderId, studentId },
                        });

                        const data = await res.json();

                        if (data.flg) {
                            await refetch();
                            resolve(data.message);
                        } else {
                            reject(data.message);
                            return;
                        }
                    } catch (error) {
                        reject(`不明なエラーが発生しました: ${error}`);
                    }
                }),
                {
                    loading: '削除中です...',
                    success: '削除しました!',
                    error: (message: string) => message,
                }
            );
        },
        [refetch]
    );

    return (
        <StudentMessagesContext.Provider
            value={{
                messages,
                adminName,
                isLoading,
                isError,
                refetch,
                markAsRead,
                deleteMessage,
            }}
        >
            {children}
        </StudentMessagesContext.Provider>
    );
};

export const useStudentMessagesContext = () => {
    const context = useContext(StudentMessagesContext);
    if (context === undefined) {
        throw new Error('useStudentMessagesContext must be used within a StudentMessagesProvider');
    }
    return context;
};
