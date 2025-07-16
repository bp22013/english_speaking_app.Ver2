/* 生徒のメッセージ用コンテキスト */

'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useStudentMessages } from '@/app/hooks/useStudentMessage';
import type { StudentMessage } from '@/types/message';

interface StudentMessagesContextType {
    messages: StudentMessage[];
    adminName: string | null;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError: any;
    refetch: () => void;
    markAsRead: (messageId: string) => Promise<void>;
    toggleReadStatus: (messageId: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
}

const StudentMessagesContext = createContext<StudentMessagesContextType | undefined>(undefined);

export const StudentMessagesProvider = ({ children }: { children: ReactNode }) => {
    const { messages, adminName, isLoading, isError, refetch } = useStudentMessages();

    // メッセージを既読にする
    const markAsRead = useCallback(
        async (messageId: string) => {
            try {
                const response = await fetch(`/api/messages/markAsRead/${messageId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('メッセージの既読化に失敗しました');
                }

                refetch();
            } catch (error) {
                console.error('既読化エラー:', error);
            }
        },
        [refetch]
    );

    // 既読・未読状態を切り替える
    const toggleReadStatus = useCallback(
        async (messageId: string) => {
            try {
                const response = await fetch(`/api/messages/toggleReadStatus/${messageId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('メッセージの状態変更に失敗しました');
                }

                refetch();
            } catch (error) {
                console.error('状態変更エラー:', error);
            }
        },
        [refetch]
    );

    // メッセージを削除する
    const deleteMessage = useCallback(
        async (messageId: string) => {
            try {
                const response = await fetch(`/api/messages/delete/${messageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('メッセージの削除に失敗しました');
                }

                refetch();
            } catch (error) {
                console.error('削除エラー:', error);
            }
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
                toggleReadStatus,
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
