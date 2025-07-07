/* メッセージ編集モーダル */

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit, Save, Bell, User, Clock } from 'lucide-react';

// フォームスキーマ
const editMessageSchema = z.object({
    content: z.string().min(1, 'メッセージ内容は必須です').max(1000, 'メッセージは1000文字以内で入力してください'),
    messageType: z.string().optional(),
    messagePriority: z.string().optional(),
    scheduledAt: z.string().optional(),
});

type EditMessageFormData = z.infer<typeof editMessageSchema>;

interface EditMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EditMessageFormData) => void;
    isSaving: boolean;
    initialData: {
        content: string;
        messageType?: string;
        messagePriority?: string;
        scheduledAt?: string;
        recipientCount: number;
    };
}

export function EditMessageModal({
    isOpen,
    onClose,
    onSave,
    isSaving,
    initialData,
}: EditMessageModalProps) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<EditMessageFormData>({
        resolver: zodResolver(editMessageSchema),
        defaultValues: {
            content: initialData.content,
            messageType: initialData.messageType || 'announcement',
            messagePriority: initialData.messagePriority || 'medium',
            scheduledAt: initialData.scheduledAt || '',
        },
    });

    const content = watch('content');

    React.useEffect(() => {
        if (isOpen) {
            reset({
                content: initialData.content,
                messageType: initialData.messageType || 'announcement',
                messagePriority: initialData.messagePriority || 'medium',
                scheduledAt: initialData.scheduledAt || '',
            });
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = (data: EditMessageFormData) => {
        onSave(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-600" />
                        メッセージを編集
                    </DialogTitle>
                    <DialogDescription>
                        メッセージの内容を編集します。変更は{initialData.recipientCount}名の生徒に反映されます。
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* メッセージタイプと優先度 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="messageType">メッセージタイプ</Label>
                                <Controller
                                    name="messageType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className='cursor-pointer'>
                                                <SelectValue placeholder="メッセージタイプ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="announcement">
                                                    <div className="flex items-center">
                                                        <Bell className="w-4 h-4 mr-2" />
                                                        お知らせ
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="personal">
                                                    <div className="flex items-center">
                                                        <User className="w-4 h-4 mr-2" />
                                                        個人メッセージ
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="reminder">
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        リマインダー
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="messagePriority">優先度</Label>
                                <Controller
                                    name="messagePriority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className='cursor-pointer'>
                                                <SelectValue placeholder="優先度を選択" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                                        低
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                                                        中
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                        高
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        {/* メッセージ内容 */}
                        <div className="space-y-2">
                            <Label htmlFor="content">メッセージ内容</Label>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="メッセージ内容を入力してください..."
                                        rows={6}
                                        className={errors.content ? 'border-red-500' : ''}
                                    />
                                )}
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500">{errors.content.message}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                {content?.length || 0} / 1000 文字
                            </p>
                        </div>

                        {/* 送信予約 */}
                        <div className="space-y-2">
                            <Label htmlFor="scheduledAt">送信予約 (オプション)</Label>
                            <Controller
                                name="scheduledAt"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="datetime-local"
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                )}
                            />
                            <p className="text-sm text-gray-500">
                                ※ 指定しない場合は即座に反映されます
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className='cursor-pointer'
                            disabled={isSaving}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? '保存中...' : '保存'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}