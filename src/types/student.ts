/* 生徒の型定義 */

export interface Student {
    studentId: string;
    name: string;
    grade: string;
    avatar?: string;
    lastLoginAt: string;
    registeredAt: string;
    isActive: boolean;
}
