'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface QuizHeaderProps {
    title?: string;
}

export const QuizHeader = ({ title = '単語問題' }: QuizHeaderProps) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleBack = () => {
        setOpen(false);
        router.back();
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* ダイアログトリガーをButtonに直接適用しないで制御 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(true)}
                        className="mr-4 cursor-pointer"
                        aria-label="戻る"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                </div>
            </div>

            {/* 戻る確認ダイアログ */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>確認</DialogTitle>
                        <DialogDescription>本当に前のページに戻りますか？</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="cursor-pointer"
                        >
                            キャンセル
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBack}
                            className="cursor-pointer"
                        >
                            戻る
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.header>
    );
};
