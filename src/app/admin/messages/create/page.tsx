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
import { motion, px } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 生徒データの型定義
interface Student {
    id: number;
    name: string;
    grade: string;
    email: string;
    avatar?: string;
    lastActive: string;
    progress: number;
}

// メッセージタイプの定義
type MessageType = 'announcement' | 'personal' | 'achievement' | 'reminder';

// サンプル生徒データ
const sampleStudents: Student[] = [
    {
        id: 1,
        name: '田中太郎',
        grade: '高校2年生',
        email: 'tanaka@example.com',
        lastActive: '10分前',
        progress: 78,
    },
    {
        id: 2,
        name: '佐藤花子',
        grade: '高校1年生',
        email: 'sato@example.com',
        lastActive: '2時間前',
        progress: 92,
    },
    {
        id: 3,
        name: '鈴木一郎',
        grade: '中学3年生',
        email: 'suzuki@example.com',
        lastActive: '昨日',
        progress: 45,
    },
    {
        id: 4,
        name: '山田美咲',
        grade: '高校3年生',
        email: 'yamada@example.com',
        lastActive: '3時間前',
        progress: 88,
    },
    {
        id: 5,
        name: '伊藤健太',
        grade: '中学2年生',
        email: 'ito@example.com',
        lastActive: '1日前',
        progress: 67,
    },
];

export default function AdminMessageCreate() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        type: 'announcement' as MessageType,
        title: '',
        content: '',
        priority: 'medium',
        scheduledAt: '',
        sendToAll: true,
        selectedStudents: [] as number[],
        selectedGrades: [] as string[],
    });

    // 学年の選択肢
    const grades = ['中学1年生', '中学2年生', '中学3年生', '高校1年生', '高校2年生', '高校3年生'];

    // フィルタリングされた生徒リスト
    const filteredStudents = sampleStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStudentToggle = (studentId: number) => {
        setFormData((prev) => ({
            ...prev,
            selectedStudents: prev.selectedStudents.includes(studentId)
                ? prev.selectedStudents.filter((id) => id !== studentId)
                : [...prev.selectedStudents, studentId],
        }));
    };

    const handleGradeToggle = (grade: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedGrades: prev.selectedGrades.includes(grade)
                ? prev.selectedGrades.filter((g) => g !== grade)
                : [...prev.selectedGrades, grade],
        }));
    };

    const handleSelectAllStudents = () => {
        setFormData((prev) => ({
            ...prev,
            selectedStudents:
                prev.selectedStudents.length === filteredStudents.length
                    ? []
                    : filteredStudents.map((student) => student.id),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 実際のアプリではここでAPIリクエストを行う
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log('Message sent:', formData);

            // 成功したらメッセージ一覧ページに戻る
            router.push('/admin/messages');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getMessageTypeConfig = (type: MessageType) => {
        switch (type) {
            case 'announcement':
                return { icon: Bell, label: 'お知らせ', color: 'blue' };
            case 'personal':
                return { icon: User, label: '個人メッセージ', color: 'green' };
            case 'achievement':
                return { icon: Award, label: '成果通知', color: 'yellow' };
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
        if (formData.sendToAll) return sampleStudents.length;

        let count = formData.selectedStudents.length;

        // 学年選択による追加
        formData.selectedGrades.forEach((grade) => {
            const gradeStudents = sampleStudents.filter((student) => student.grade === grade);
            gradeStudents.forEach((student) => {
                if (!formData.selectedStudents.includes(student.id)) {
                    count++;
                }
            });
        });

        return count;
    };

    const typeConfig = getMessageTypeConfig(formData.type);
    const TypeIcon = typeConfig.icon;

    return (
        <div className="min-h-screen bg-gray-50">
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
                                                                    formData.priority
                                                                )}
                                                            >
                                                                優先度:{' '}
                                                                {getPriorityLabel(
                                                                    formData.priority
                                                                )}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date().toLocaleDateString('ja-JP')}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        {formData.title ||
                                                            'タイトルが入力されていません'}
                                                    </h3>
                                                    <p className="text-gray-700 whitespace-pre-wrap">
                                                        {formData.content ||
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
                                    <form onSubmit={handleSubmit}>
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
                                                        <Select
                                                            value={formData.type}
                                                            onValueChange={(value) =>
                                                                handleSelectChange(
                                                                    'type',
                                                                    value as MessageType
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
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
                                                                <SelectItem value="achievement">
                                                                    <div className="flex items-center">
                                                                        <Award className="w-4 h-4 mr-2" />
                                                                        成果通知
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
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="priority">優先度</Label>
                                                        <Select
                                                            value={formData.priority}
                                                            onValueChange={(value) =>
                                                                handleSelectChange(
                                                                    'priority',
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
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
                                                    </div>
                                                </div>

                                                {/* タイトル */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">タイトル</Label>
                                                    <Input
                                                        id="title"
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleChange}
                                                        placeholder="メッセージのタイトルを入力"
                                                        required
                                                    />
                                                </div>

                                                {/* メッセージ内容 */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="content">メッセージ内容</Label>
                                                    <Textarea
                                                        id="content"
                                                        name="content"
                                                        value={formData.content}
                                                        onChange={handleChange}
                                                        placeholder="メッセージの内容を入力してください..."
                                                        rows={8}
                                                        required
                                                    />
                                                    <p className="text-sm text-gray-500">
                                                        {formData.content.length} / 1000 文字
                                                    </p>
                                                </div>

                                                {/* 送信予約 */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="scheduledAt">
                                                        送信予約 (オプション)
                                                    </Label>
                                                    <Input
                                                        id="scheduledAt"
                                                        name="scheduledAt"
                                                        type="datetime-local"
                                                        value={formData.scheduledAt}
                                                        onChange={handleChange}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                    />
                                                    <p className="text-sm text-gray-500">
                                                        指定しない場合は即座に送信されます
                                                    </p>
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
                                                        disabled={
                                                            isSubmitting ||
                                                            !formData.title ||
                                                            !formData.content
                                                        }
                                                        className="bg-purple-600 hover:bg-purple-700"
                                                    >
                                                        <Send className="mr-2 h-4 w-4" />
                                                        {isSubmitting
                                                            ? '送信中...'
                                                            : formData.scheduledAt
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
                                                <Checkbox
                                                    id="sendToAll"
                                                    checked={formData.sendToAll}
                                                    onCheckedChange={(checked: boolean) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            sendToAll: checked as boolean,
                                                        }))
                                                    }
                                                />
                                                <Label
                                                    htmlFor="sendToAll"
                                                    className="text-sm font-medium"
                                                >
                                                    全生徒に送信 ({sampleStudents.length}名)
                                                </Label>
                                            </div>

                                            {!formData.sendToAll && (
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
                                                                        checked={formData.selectedGrades.includes(
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
                                                                size="sm"
                                                                onClick={handleSelectAllStudents}
                                                            >
                                                                {formData.selectedStudents
                                                                    .length ===
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
                                                            {filteredStudents.map((student) => (
                                                                <motion.div
                                                                    key={student.id}
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                                                                >
                                                                    <Checkbox
                                                                        id={`student-${student.id}`}
                                                                        checked={formData.selectedStudents.includes(
                                                                            student.id
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            handleStudentToggle(
                                                                                student.id
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
                                                                            {student.name.charAt(0)}
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
                                                            ))}
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
                                                    className={getPriorityColor(formData.priority)}
                                                >
                                                    {getPriorityLabel(formData.priority)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">受信者数:</span>
                                                <span className="font-medium">
                                                    {getRecipientCount()}名
                                                </span>
                                            </div>
                                            {formData.scheduledAt && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">送信予定:</span>
                                                    <span className="font-medium">
                                                        {new Date(
                                                            formData.scheduledAt
                                                        ).toLocaleString('ja-JP')}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.scheduledAt && (
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
