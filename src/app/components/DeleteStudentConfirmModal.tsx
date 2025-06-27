/* 生徒の削除確認モーダル */

'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    studentName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    studentName,
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="w-5 h-5" />
                        生徒の削除確認
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4 text-sm text-gray-700">
                    <p>
                        <strong>{studentName}</strong> さんのデータを本当に削除しますか？
                    </p>
                    <p className="mt-1 text-gray-500">※この操作は取り消せません。</p>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} className="cursor-pointer">
                        キャンセル
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={onConfirm}
                    >
                        削除する
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
