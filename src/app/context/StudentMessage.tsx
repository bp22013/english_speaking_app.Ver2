// context/StudentMessagesContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStudentMessages } from '@/app/hooks/useStudentMessage';

export interface StudentMessage {
    id: string;
    studentId: string;
    senderId: string;
    content: string;
    messageType: string;
    messagePriority: string;
    isRead: boolean;
    sentAt: string;
    scheduledAt: string | null;
}

interface StudentMessagesContextType {
    messages: StudentMessage[];
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isError: any;
    refetch: () => void;
}

const StudentMessagesContext = createContext<StudentMessagesContextType | undefined>(undefined);

export const StudentMessagesProvider = ({ children }: { children: ReactNode }) => {
    const { messages, isLoading, isError, refetch } = useStudentMessages();

    return (
        <StudentMessagesContext.Provider value={{ messages, isLoading, isError, refetch }}>
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
