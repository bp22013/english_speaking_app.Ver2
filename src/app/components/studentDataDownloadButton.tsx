'use client';

import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// Student 型定義
export interface Student {
    studentId: string;
    name: string;
    grade: string | null;
    lastLoginAt: string | null;
    registeredAt: string | null;
    isActive: boolean;
}

// Props の型を明示
interface StudentDataDownloadProps {
    data: Student[];
}

export const StudentDataDownload = ({ data }: StudentDataDownloadProps) => {
    const handleDownload = (selectedFormat: 'csv' | 'xlsx') => {
        if (data.length === 0) return;

        if (selectedFormat === 'csv') {
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map((row) =>
                    headers.map((field) => `"${(row as any)[field] ?? ''}"`).join(',')
                ),
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    エクスポート
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleDownload('csv')} className="cursor-pointer">
                    CSV形式（.csv）でダウンロード
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')} className="cursor-pointer">
                    Excel形式（.xlsx）でダウンロード
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
