'use client';

import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';

interface VocabularyItem {
    id: string;
    word: string;
    meaning: string | null;
    level: number | null;
    addedAt: string | null;
}

interface Props {
    data: VocabularyItem[];
}

export const VocabularyDownloadButton = ({ data }: Props) => {
    const handleDownloadCSV = () => {
        const headers = ['単語', '意味', 'レベル', '追加日'];
        const rows = data.map((item) => [item.word, item.meaning, ` ${item.level}`, item.addedAt]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, 'vocabulary.csv');
    };

    const handleDownloadXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            data.map((item) => ({
                単語: item.word,
                意味: item.meaning,
                レベル: `${item.level}`,
                追加日: item.addedAt,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '単語リスト');

        const xlsxBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const url = URL.createObjectURL(new Blob([xlsxBlob], { type: 'application/octet-stream' }));
        triggerDownload(url, 'vocabulary.xlsx');
    };

    const triggerDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadCSV} className="cursor-pointer">
                    CSV形式（.csv）でダウンロード
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadXLSX} className="cursor-pointer">
                    Excel形式（.xlsx）でダウンロード
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
