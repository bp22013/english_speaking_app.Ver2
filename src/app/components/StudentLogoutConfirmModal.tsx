'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { mutate } from 'swr';
import { client } from '@/lib/HonoClient';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: string;
    studentId: string;
}

export const LogoutConfirmDialog = ({ open, onOpenChange, sessionId, studentId }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                setIsLoading(true);
                try {
                    const res = await client.api.auth.studentLogout.$post({
                        json: { sessionId, studentId: studentId },
                        credentials: 'include',
                    });

                    const data = await res.json();

                    if (data.flg) {
                        resolve(data.message);
                        mutate('/api/auth/getStudentInfo');
                        router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/`);
                    } else {
                        reject(data.error || 'ログアウトに失敗しました');
                    }
                } catch (error) {
                    console.error(error);
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsLoading(false);
                    onOpenChange(false);
                }
            }),
            {
                loading: 'ログアウトしています...',
                success: 'ログアウトしました！',
                error: (message: string) => message,
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-100">
                <DialogHeader>
                    <DialogTitle>ログアウトの確認</DialogTitle>
                </DialogHeader>
                <p>本当にログアウトしますか？</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading} className="cursor-pointer">
                            キャンセル
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        {isLoading ? '処理中...' : 'ログアウトする'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
