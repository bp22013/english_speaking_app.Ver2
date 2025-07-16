/* 生徒側のメッセージ部分のアクションドロップダウン */

'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MoreVertical, Eye, EyeOff, Trash2 } from 'lucide-react';

interface MessageActionDropdownProps {
    messageId: string;
    isRead: boolean;
    toggleReadStatus?: (id: string) => void;
    deleteMessage?: (id: string) => void;
}

export default function MessageActionDropdown({
    messageId,
    isRead,
    toggleReadStatus,
    deleteMessage,
}: MessageActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => toggleReadStatus && toggleReadStatus(messageId)}
                    className="text-blue-500 cursor-pointer hover:!bg-blue-100 focus:!text-blue-600 focus:!bg-blue-100"
                >
                    {isRead ? (
                        <>
                            <EyeOff className="w-4 h-4 mr-2 text-blue-500" />
                            未読にする
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4 mr-2 text-blue-500" />
                            既読にする
                        </>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 hover:!bg-red-100 focus:!text-red-600 cursor-pointer focus:!bg-red-100"
                        >
                            <Trash2 className="w-4 h-4 mr-2 focus:!text-red-600" />
                            削除
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>メッセージを削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                                この操作は取り消すことができません。メッセージが完全に削除されます。
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteMessage && deleteMessage(messageId)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                削除
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
