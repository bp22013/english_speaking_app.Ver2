'use client';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Eye, Edit, Mail, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StudentEditModal } from './StudentEditModal';
import { DeleteConfirmationModal } from './DeleteStudentConfirmModal';

type Props = {
    studentId: string;
    studentName: string;
    grade: string | null;
    onViewDetails: () => void;
    onDelete: (studentId: string) => void;
};

export const StudentActionDropdown = ({
    studentId,
    studentName,
    grade,
    onViewDetails,
    onDelete,
}: Props) => {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>アクション</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onViewDetails} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        詳細を見る
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        編集
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/messages`)
                        }
                        className="cursor-pointer"
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        メッセージ送信
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 hover:!bg-red-100 focus:!text-red-600 cursor-pointer focus:!bg-red-100"
                    >
                        <Trash2 className="mr-2 h-4 w-4 focus:!text-red-600" />
                        削除
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 編集モーダル */}
            <StudentEditModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                studentId={studentId}
                studentName={studentName}
                grade={grade}
            />

            {/* 削除確認モーダル */}
            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    onDelete(studentId); // 🔸渡された関数を実行
                    setIsDeleteModalOpen(false);
                }}
                studentName={studentName}
            />
        </>
    );
};
