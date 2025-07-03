/* 管理者メッセージのコンテキスト */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminMessages } from '@/app/hooks/useAdminMessages';

// メッセージの型定義
export interface AdminMessage {
    senderId: string | undefined;
    recipients: any;
    totalRecipients: any;
    readCount: any;
    id: string;
    studentId: string;
    studentName: string;
    studentGrade: string;
    content: string;
    messageType: string;
    messagePriority: string;
    isRead: boolean;
    sentAt: string;
    scheduledAt: string | null;
}

// コンテキストの型定義
interface AdminMessagesContextType {
    messages: AdminMessage[];
    isLoading: boolean;
    isError: any;
    refetch: () => void;
}

// コンテキストの作成
const AdminMessagesContext = createContext<AdminMessagesContextType | undefined>(undefined);

// プロバイダーコンポーネント
interface AdminMessagesProviderProps {
    children: ReactNode;
}

export function AdminMessagesProvider({ children }: AdminMessagesProviderProps) {
    const { messages, isLoading, isError, refetch } = useAdminMessages();

    return (
        <AdminMessagesContext.Provider value={{ messages, isLoading, isError, refetch }}>
            {children}
        </AdminMessagesContext.Provider>
    );
}

// カスタムフック
export function useAdminMessagesContext() {
    const context = useContext(AdminMessagesContext);
    if (context === undefined) {
        throw new Error('useAdminMessagesContext must be used within an AdminMessagesProvider');
    }
    return context;
}