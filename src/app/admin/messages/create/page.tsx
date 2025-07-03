/* メッセージを作成するページ */

'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessageFromAdminValidation, sendMessageFromAdminFormData } from '@/lib/validation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Mail,
    Send,
    ArrowLeft,
    Users,
    User,
    Bell,
    Award,
    Search,
    Clock,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { AdminNavigation } from '../../../components/AdminNavigation';
import { PageTransition, FadeIn, SoftFadeIn } from '../../../components/page-transition';
import { motion } from 'framer-motion';
import { useAdminSession } from '@/app/context/AdminAuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStudents } from '@/app/hooks/useStudents';
import { client } from '@/lib/HonoClient';
import toast from 'react-hot-toast';
import Loading from '@/app/loading';

// 生徒データの型定義
interface Student {
    id: string;
    name: string;
    grade: string;
    studentId: string;
    avatar?: string;
    lastActive: string;
}

// メッセージタイプの定義
type MessageType = 'announcement' | 'personal' | 'reminder';

export default function AdminMessageCreate() {
    const router = useRouter();
    const { user } = useAdminSession();
    const { students, isLoading } = useStudents();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // 学年の選択肢
    const grades = ['中学1年生', '中学2年生', '中学3年生', '高校1年生', '高校2年生', '高校3年生'];

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<sendMessageFromAdminFormData>({
        resolver: zodResolver(sendMessageFromAdminValidation),
        defaultValues: {
            type: 'announcement',
            title: '',
            content: '',
            priority: 'medium',
            scheduledAt: '',
            sendToAll: true,
            selectedStudents: [],
            selectedGrades: [],
        },
    });

    const type = watch('type');
    const title = watch('title');
    const content = watch('content');
    const priority = watch('priority');
    const scheduledAt = watch('scheduledAt');
    const selectedStudents = watch('selectedStudents') ?? [];
    const selectedGrades = watch('selectedGrades') ?? [];
    const sendToAll = watch('sendToAll');

    // フィルタリングされた生徒リスト
    const filteredStudents = students.filter(
        (student: Student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStudentToggle = (studentId: string) => {
        const current = getValues('selectedStudents') ?? [];
        const updated = current.includes(studentId)
            ? current.filter((id) => id !== studentId)
            : [...current, studentId];
        setValue('selectedStudents', updated);
    };

    const handleGradeToggle = (grade: string) => {
        const current = getValues('selectedGrades') ?? [];
        const updated = current.includes(grade)
            ? current.filter((g) => g !== grade)
            : [...current, grade];

        setValue('selectedGrades', updated);
    };

    const handleSelectAllStudents = () => {
        const current = getValues('selectedStudents') ?? [];
        const allStudentIds: string[] = filteredStudents.map((student: Student) =>
            String(student.id)
        );
        const isAllSelected = current.length === allStudentIds.length;
        const updated = isAllSelected ? [] : allStudentIds;
        setValue('selectedStudents', updated);
    };

    const onSubmit: SubmitHandler<sendMessageFromAdminFormData> = async (data) => {
        setIsSubmitting(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.messages.sendMessageFromAdmin.$post({
                        json: {
                            senderId: user?.id,
                            content: data.content,
                            messageType: data.type,
                            messagePriority: data.priority,
                            scheduledAt: data.scheduledAt,
                            sendToAll: data.sendToAll,
                            selectedStudents: data.selectedStudents,
                            selectedGrades: data.selectedGrades,
                        },
                    });

                    const responceData = await res.json();

                    if (responceData.flg) {
                        resolve(responceData.message);
                        router.push('/admin/messages');
                    } else {
                        reject(responceData.message);
                    }
                } catch (error) {
                    console.log(error);
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsSubmitting(false);
                }
            }),
            {
                loading: 'メッセージを送信しています...',
                success: '送信しました!',
                error: (message: string) => message,
            }
        );
    };

    const getMessageTypeConfig = (type: MessageType) => {
        switch (type) {
            case 'announcement':
                return { icon: Bell, label: 'お知らせ', color: 'blue' };
            case 'personal':
                return { icon: User, label: '個人メッセージ', color: 'green' };
            case 'reminder':
                return { icon: Clock, label: 'リマインダー', color: 'purple' };
            default:
                return { icon: Mail, label: 'メッセージ', color: 'gray' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high':
                return '高';
            case 'medium':
                return '中';
            case 'low':
                return '低';
            default:
                return priority;
        }
    };

    const getRecipientCount = () => {
        if (sendToAll) return students.length;

        let count = selectedStudents.length;

        selectedGrades.forEach((grade) => {
            const gradeStudents = students.filter((student: Student) => student.grade === grade);
            gradeStudents.forEach((student: Student) => {
                if (!selectedStudents.includes(String(student.id))) {
                    count++;
                }
            });
        });

        return count;
    };

    const typeConfig = getMessageTypeConfig(type);
    const TypeIcon = typeConfig.icon;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={`min-h-screen bg-gray-50 ${sendToAll ? 'overflow-y-scroll' : ''}`}>
            <AdminNavigation currentPage="messages" />
            <PageTransition>
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        onClick={() => router.push('/admin/messages')}
                                        className="rounded-full cursor-pointer"
                                    >
                                        <ArrowLeft className="w-20 h-20 text-gray-600" />
                                    </Button>

                                    <div>
                                        <motion.h1
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2, duration: 0.6 }}
                                            className="text-3xl font-bold text-gray-900 mb-2"
                                        >
                                            メッセージ作成
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}
                                            className="text-gray-600"
                                        >
                                            生徒にメッセージを送信します
                                        </motion.p>
                                    </div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="flex space-x-3"
                                >
                                    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="cursor-pointer">
                                                プレビュー
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <TypeIcon
                                                        className={`w-5 h-5 text-${typeConfig.color}-600`}
                                                    />
                                                    メッセージプレビュー
                                                </DialogTitle>
                                                <DialogDescription>
                                                    送信前にメッセージの内容を確認してください
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div className="border rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={`bg-${typeConfig.color}-50 text-${typeConfig.color}-700`}
                                                            >
                                                                {typeConfig.label}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className={getPriorityColor(
                                                                    priority
                                                                )}
                                                            >
                                                                優先度: {getPriorityLabel(priority)}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date().toLocaleDateString('ja-JP')}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {title || 'タイトルが入力されていません'}
                                                    </h3>
                                                    <p className="text-gray-700 whitespace-pre-wrap">
                                                        {content ||
                                                            'メッセージ内容が入力されていません'}
                                                    </p>
                                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                                        <p className="text-sm text-gray-500">
                                                            送信者: 山田先生 (管理者)
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            受信者: {getRecipientCount()}名の生徒
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </motion.div>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* メッセージ作成フォーム */}
                            <div className="lg:col-span-2">
                                <SoftFadeIn delay={0.2}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Card className="hover:shadow-lg transition-shadow duration-300">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="flex items-center space-x-2">
                                                    <Mail className="w-5 h-5 text-purple-600" />
                                                    <span>メッセージ内容</span>
                                                </CardTitle>
                                                <CardDescription>
                                                    送信するメッセージの内容を入力してください
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                {/* メッセージタイプと優先度 */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="type">
                                                            メッセージタイプ
                                                        </Label>
                                                        <Controller
                                                            name="type"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                >
                                                                    <SelectTrigger className="cursor-pointer">
                                                                        <SelectValue placeholder="メッセージタイプ" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem
                                                                            value="announcement"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <Bell className="w-4 h-4 mr-2" />
                                                                                お知らせ
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="personal"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <User className="w-4 h-4 mr-2" />
                                                                                個人メッセージ
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="reminder"
                                                                            className="cursor-pointer"
                                                                        >
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
                                                        <Label htmlFor="priority">優先度</Label>
                                                        <Controller
                                                            name="priority"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={field.onChange}
                                                                >
                                                                    <SelectTrigger className="cursor-pointer">
                                                                        <SelectValue placeholder="優先度を選択" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem
                                                                            value="low"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                                                                低
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="medium"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                                                                                中
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="high"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                                                高
                                                                            </div>
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.priority && (
                                                            <p className="text-sm text-red-500">
                                                                {errors.priority.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* タイトル */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">タイトル</Label>
                                                    <Controller
                                                        name="title"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="メッセージのタイトルを入力"
                                                                />
                                                                {errors.title && (
                                                                    <p className="text-sm text-red-500">
                                                                        {errors.title.message}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                </div>

                                                {/* メッセージ内容 */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="content">メッセージ内容</Label>
                                                    <Controller
                                                        name="content"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="メッセージ内容を入力してください..."
                                                                    rows={6}
                                                                />
                                                                {errors.content && (
                                                                    <p className="text-sm text-red-500">
                                                                        {errors.content.message}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    />

                                                    <p className="text-sm text-gray-500">
                                                        {content.length} / 1000 文字
                                                    </p>
                                                </div>

                                                {/* 送信予約 */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="scheduledAt">
                                                        送信予約 (オプション)
                                                    </Label>
                                                    <Controller
                                                        name="scheduledAt"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <>
                                                                <Input
                                                                    {...field}
                                                                    type="datetime-local"
                                                                    min={new Date()
                                                                        .toISOString()
                                                                        .slice(0, 16)}
                                                                />
                                                                <p className="text-sm text-gray-500">
                                                                    ※
                                                                    指定しない場合は即座に送信されます
                                                                </p>
                                                            </>
                                                        )}
                                                    />
                                                </div>

                                                {/* 送信ボタン */}
                                                <div className="flex justify-end space-x-3 pt-4">
                                                    <Button type="button" variant="outline" asChild>
                                                        <Link href="/admin/messages">
                                                            キャンセル
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="bg-purple-600 cursor-pointer hover:bg-purple-700"
                                                    >
                                                        <Send className="mr-2 h-4 w-4" />
                                                        {isSubmitting
                                                            ? '送信中...'
                                                            : scheduledAt
                                                            ? '予約送信'
                                                            : '送信'}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </form>
                                </SoftFadeIn>
                            </div>

                            {/* 受信者選択 */}
                            <div className="space-y-6">
                                <SoftFadeIn delay={0.3}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-purple-600" />
                                                <span>受信者選択</span>
                                            </CardTitle>
                                            <CardDescription>
                                                メッセージを送信する対象を選択してください
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* 全員に送信 */}
                                            <div className="flex items-center space-x-2">
                                                <Controller
                                                    name="sendToAll"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={(checked) =>
                                                                    field.onChange(!!checked)
                                                                }
                                                            />
                                                            <Label>全生徒に送信</Label>
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            {!sendToAll && (
                                                <div className="space-y-4">
                                                    {/* 学年選択 */}
                                                    <div>
                                                        <Label className="text-sm font-medium mb-2 block">
                                                            学年で選択
                                                        </Label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {grades.map((grade) => (
                                                                <div
                                                                    key={grade}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <Checkbox
                                                                        id={`grade-${grade}`}
                                                                        checked={selectedGrades.includes(
                                                                            grade
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            handleGradeToggle(grade)
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`grade-${grade}`}
                                                                        className="text-xs"
                                                                    >
                                                                        {grade}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* 個別生徒選択 */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <Label className="text-sm font-medium">
                                                                個別選択
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="cursor-pointer"
                                                                size="sm"
                                                                onClick={handleSelectAllStudents}
                                                            >
                                                                {selectedStudents.length ===
                                                                filteredStudents.length
                                                                    ? '全選択解除'
                                                                    : '全選択'}
                                                            </Button>
                                                        </div>

                                                        {/* 検索 */}
                                                        <div className="relative mb-3">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            <Input
                                                                placeholder="生徒を検索..."
                                                                value={searchQuery}
                                                                onChange={(e) =>
                                                                    setSearchQuery(e.target.value)
                                                                }
                                                                className="pl-10"
                                                            />
                                                        </div>

                                                        {/* 生徒リスト */}
                                                        <div className="max-h-64 overflow-y-auto space-y-2">
                                                            {filteredStudents.map(
                                                                (student: Student) => (
                                                                    <motion.div
                                                                        key={student.studentId}
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                                                                    >
                                                                        <Checkbox
                                                                            id={`student-${student.id}`}
                                                                            checked={selectedStudents.includes(
                                                                                String(student.id)
                                                                            )}
                                                                            onCheckedChange={() =>
                                                                                handleStudentToggle(
                                                                                    String(
                                                                                        student.id
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                        <Avatar className="w-6 h-6">
                                                                            <AvatarImage
                                                                                src={
                                                                                    student.avatar ||
                                                                                    '/placeholder.svg'
                                                                                }
                                                                                alt={student.name}
                                                                            />
                                                                            <AvatarFallback className="text-xs">
                                                                                {student.name.charAt(
                                                                                    0
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                                {student.name}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {student.grade}
                                                                            </p>
                                                                        </div>
                                                                    </motion.div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 受信者数表示 */}
                                            <div className="pt-3 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">
                                                        送信対象:
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-purple-50 text-purple-700"
                                                    >
                                                        {getRecipientCount()}名
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </SoftFadeIn>

                                {/* 送信予定の確認 */}
                                <SoftFadeIn delay={0.4}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center space-x-2">
                                                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                                <span>送信確認</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    メッセージタイプ:
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`bg-${typeConfig.color}-50 text-${typeConfig.color}-700`}
                                                >
                                                    {typeConfig.label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">優先度:</span>
                                                <Badge
                                                    variant="outline"
                                                    className={getPriorityColor(priority)}
                                                >
                                                    {getPriorityLabel(priority)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">受信者数:</span>
                                                <span className="font-medium">
                                                    {getRecipientCount()}名
                                                </span>
                                            </div>
                                            {scheduledAt && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">送信予定:</span>
                                                    <span className="font-medium">
                                                        {new Date(scheduledAt).toLocaleString(
                                                            'ja-JP'
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {scheduledAt && (
                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <div className="flex items-center">
                                                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                                                        <p className="text-sm text-yellow-800">
                                                            このメッセージは予約送信されます
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </SoftFadeIn>
                            </div>
                        </div>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
