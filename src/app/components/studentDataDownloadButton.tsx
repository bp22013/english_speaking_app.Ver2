'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export const StudentDataDownload = () => {
    const handleDownload = (selectedFormat: 'csv' | 'xlsx') => {
        const data = [
            { name: '田中太郎', email: 'tanaka@example.com', grade: '高校2年' },
            { name: '佐藤花子', email: 'sato@example.com', grade: '高校1年' },
        ];

        if (selectedFormat === 'csv') {
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map((row) =>
                    headers.map((field) => `"${row[field as keyof typeof row]}"`).join(',')
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
                    CSV形式でダウンロード（.csv）
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('xlsx')} className="cursor-pointer">
                    XLSX形式でダウンロード（.xlsx）
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
