/* メッセージ関連の型定義 */

export type MessageType = 'announcement' | 'personal' | 'reminder';

export interface AdminMessage {
    id: string;
    studentId: string;
    studentName: string;
    studentGrade: string;
    title: string;
    content: string;
    messageType: string;
    messagePriority: string;
    isRead: boolean;
    sentAt: string;
    scheduledAt: string | null;
    senderId: string;
    recipients: Array<{
        studentId: string;
        studentName: string;
        studentGrade: string;
        isRead: boolean;
    }>;
    totalRecipients: number;
    readCount: number;
}

export interface StudentMessage {
    id: string;
    studentId: string;
    senderId: string;
    title: string;
    content: string;
    messageType: string;
    messagePriority: string;
    isRead: boolean;
    sentAt: string;
    scheduledAt: string | null;
}
