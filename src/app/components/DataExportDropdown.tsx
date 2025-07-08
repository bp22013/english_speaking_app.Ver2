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

interface DataExportDropdownProps {
    data: any[];
    filename: string;
    sheetName: string;
    className?: string;
    disabled?: boolean;
}

export const DataExportDropdown = ({ 
    data, 
    filename, 
    sheetName, 
    className = "",
    disabled = false 
}: DataExportDropdownProps) => {
    const handleDownload = (selectedFormat: 'csv' | 'xlsx') => {
        if (data.length === 0) return;

        if (selectedFormat === 'csv') {
            // CSV形式でのエクスポート
            const headers = Object.keys(data[0]);
            const csv = [
                headers.join(','),
                ...data.map((row) =>
                    headers.map((field) => `"${(row as any)[field] ?? ''}"`).join(',')
                ),
            ].join('\n');

            // BOM付きUTF-8でエンコード（Excel対応）
            const bom = '\uFEFF';
            const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            // Excel形式でのエクスポート
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

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
            link.setAttribute('download', `${filename}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    className={`cursor-pointer ${className}`}
                    disabled={disabled || data.length === 0}
                    title={data.length === 0 ? 'エクスポートできるデータがありません' : ''}
                >
                    <Download className="mr-2 h-4 w-4" />
                    エクスポート {data.length === 0 && '(データなし)'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem 
                    onClick={() => handleDownload('csv')} 
                    className="cursor-pointer"
                >
                    CSV形式（.csv）でダウンロード
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => handleDownload('xlsx')} 
                    className="cursor-pointer"
                >
                    Excel形式（.xlsx）でダウンロード
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};