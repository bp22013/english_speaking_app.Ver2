/* 管理者のメッセージアクションドロップダウン */

'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminMessageActionDropdownProps {
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function AdminMessageActionDropdown({
    onView,
    onEdit,
    onDelete,
}: AdminMessageActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                    className="cursor-pointer"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    詳細を見る
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="text-blue-500 cursor-pointer hover:!bg-blue-100 focus:!text-blue-600 focus:!bg-blue-100"
                >
                    <Edit className="mr-2 h-4 w-4 text-blue-500" />
                    編集
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-red-600 hover:!bg-red-100 focus:!text-red-600 cursor-pointer focus:!bg-red-100"
                >
                    <Trash2 className="w-4 h-4 mr-2 focus:!text-red-600" />
                    削除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
