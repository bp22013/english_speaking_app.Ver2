/* メッセージ削除確認モーダル */

'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    messageContent: string;
    recipientCount: number;
}

export function DeleteMessageModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    messageContent,
    recipientCount,
}: DeleteMessageModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        メッセージを削除
                    </DialogTitle>
                    <DialogDescription>
                        この操作は取り消すことができません。本当に削除しますか？
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-medium mb-2">削除対象のメッセージ:</p>
                        <p className="text-sm text-red-700 line-clamp-3">
                            {messageContent}
                        </p>
                        <p className="text-xs text-red-600 mt-2">
                            送信先: {recipientCount}名の生徒
                        </p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">注意</p>
                                <p className="text-xs text-yellow-700">
                                    削除すると、すべての受信者からメッセージが削除されます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className='cursor-pointer'
                    >
                        キャンセル
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="gap-2 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? '削除中...' : '削除する'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}