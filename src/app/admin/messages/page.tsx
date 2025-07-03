'use client';

import { useState, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useAdminMessagesContext } from '@/app/context/AdminMessagesContext';
import { useAdminSession } from '@/app/context/AdminAuthContext';
import { DeleteMessageModal } from '@/app/components/DeleteMessageModal';
import { EditMessageModal } from '@/app/components/EditMessageModal';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
    Mail,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Send,
    Clock,
    Users,
    Bell,
    User,
    Award,
    Eye,
    Calendar,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import {
    PageTransition,
    FadeIn,
    SoftFadeIn,
    StaggerContainer,
} from '../../components/page-transition';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// AdminMessagesContextの型を使用
type AdminMessage = ReturnType<typeof useAdminMessagesContext>['messages'][0];

export default function AdminMessages() {
    const { messages, isLoading, refetch } = useAdminMessagesContext();
    const { user } = useAdminSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    // 削除モーダル用の状態
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<AdminMessage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // 編集モーダル用の状態
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState<AdminMessage | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();

    // フィルタリング
    const filteredMessages = messages.filter((message: AdminMessage) => {
        const matchesSearch =
            message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.recipients?.some((recipient: any) => 
                recipient.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        const matchesType = selectedType === 'all' || message.messageType === selectedType;
        // スケジュール状態の判定
        const status = message.scheduledAt ? 'scheduled' : 'sent';
        const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeConfig = (type: string) => {
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'sent':
                return { label: '送信済み', color: 'bg-green-100 text-green-700 border-green-200' };
            case 'scheduled':
                return { label: '予約中', color: 'bg-blue-100 text-blue-700 border-blue-200' };
            case 'draft':
                return { label: '下書き', color: 'bg-gray-100 text-gray-700 border-gray-200' };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            case 'low':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-300';
        }
    };

    const handleViewDetails = (message: AdminMessage) => {
        setSelectedMessage(message);
        setIsDetailOpen(true);
    };

    // 削除機能
    const handleDeleteMessage = (message: AdminMessage) => {
        setMessageToDelete(message);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;
        
        setIsDeleting(true);
        try {
            const response = await fetch('/api/messages/deleteMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageIds: [messageToDelete.id],
                    senderId: user?.id || messageToDelete.senderId || 'unknown',
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.flg) {
                toast.success('メッセージを削除しました');
                refetch();
                setIsDeleteModalOpen(false);
                setMessageToDelete(null);
            } else {
                toast.error(data.message || 'メッセージの削除に失敗しました');
            }
        } catch (error) {
            console.error('削除エラー:', error);
            toast.error('メッセージの削除に失敗しました');
        } finally {
            setIsDeleting(false);
        }
    };

    // 編集機能
    const handleEditMessage = (message: AdminMessage) => {
        setMessageToEdit(message);
        setIsEditModalOpen(true);
    };

    const saveEditMessage = async (data: any) => {
        if (!messageToEdit) return;
        
        setIsSaving(true);
        try {
            const response = await fetch('/api/messages/updateMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId: messageToEdit.id,
                    ...data,
                    senderId: user?.id || messageToEdit.senderId || 'unknown',
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.flg) {
                toast.success('メッセージを更新しました');
                refetch();
                setIsEditModalOpen(false);
                setMessageToEdit(null);
            } else {
                toast.error(result.message || 'メッセージの更新に失敗しました');
            }
        } catch (error) {
            console.error('更新エラー:', error);
            toast.error('メッセージの更新に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation currentPage="messages" />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="text-3xl font-bold text-gray-900 mb-2"
                                    >
                                        メッセージ管理
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-gray-600"
                                    >
                                        生徒に送信したメッセージの管理と新規作成
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mt-4 md:mt-0"
                                >
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                        onClick={() => router.push('/admin/messages/create')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        メッセージ作成
                                    </Button>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* 統計カード */}
                        <StaggerContainer>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    {
                                        title: '総メッセージ数',
                                        value: messages.length.toString(),
                                        icon: Mail,
                                        color: 'blue',
                                    },
                                    {
                                        title: '送信済み',
                                        value: messages
                                            .filter((m) => !m.scheduledAt)
                                            .length.toString(),
                                        icon: Send,
                                        color: 'green',
                                    },
                                    {
                                        title: '予約中',
                                        value: messages
                                            .filter((m) => m.scheduledAt)
                                            .length.toString(),
                                        icon: Calendar,
                                        color: 'yellow',
                                    },
                                    {
                                        title: '既読率',
                                        value: messages.length > 0 
                                            ? `${Math.round(messages.reduce((acc, m) => acc + (m.readCount / m.totalRecipients * 100), 0) / messages.length)}%`
                                            : '0%',
                                        icon: Eye,
                                        color: 'blue',
                                    },
                                ].map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={stat.title}
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: { opacity: 1 },
                                            }}
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                                <CardContent className="p-6 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">
                                                            {stat.title}
                                                        </p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {stat.value}
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}
                                                    >
                                                        <Icon
                                                            className={`w-6 h-6 text-${stat.color}-600`}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </StaggerContainer>

                        {/* 検索とフィルター */}
                        <SoftFadeIn delay={0.2}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="メッセージを検索..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Select
                                                value={selectedType}
                                                onValueChange={setSelectedType}
                                            >
                                                <SelectTrigger className="w-[180px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedType === 'all'
                                                                ? 'すべてのタイプ'
                                                                : getTypeConfig(selectedType).label}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        すべてのタイプ
                                                    </SelectItem>
                                                    <SelectItem value="announcement">
                                                        お知らせ
                                                    </SelectItem>
                                                    <SelectItem value="personal">
                                                        個人メッセージ
                                                    </SelectItem>
                                                    <SelectItem value="achievement">
                                                        成果通知
                                                    </SelectItem>
                                                    <SelectItem value="reminder">
                                                        リマインダー
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={selectedStatus}
                                                onValueChange={setSelectedStatus}
                                            >
                                                <SelectTrigger className="w-[150px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedStatus === 'all'
                                                                ? '全ステータス'
                                                                : getStatusConfig(selectedStatus)
                                                                      .label}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        全ステータス
                                                    </SelectItem>
                                                    <SelectItem value="sent">送信済み</SelectItem>
                                                    <SelectItem value="scheduled">
                                                        予約中
                                                    </SelectItem>
                                                    <SelectItem value="draft">下書き</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>

                        {/* メッセージ一覧 */}
                        <SoftFadeIn delay={0.3}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Mail className="w-5 h-5 text-purple-600" />
                                            <span>メッセージ一覧</span>
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">
                                            {filteredMessages.length} / {messages.length} 件表示
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {filteredMessages.map((message) => {
                                                const typeConfig = getTypeConfig(message.messageType || 'announcement');
                                                const status = message.scheduledAt ? 'scheduled' : 'sent';
                                                const statusConfig = getStatusConfig(status);
                                                const TypeIcon = typeConfig.icon;

                                                return (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        whileHover={{ scale: 1.01 }}
                                                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md border-l-4 ${getPriorityColor(
                                                            message.messagePriority || 'medium'
                                                        )}`}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start space-x-4 flex-1">
                                                                <div
                                                                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-${typeConfig.color}-100`}
                                                                >
                                                                    <TypeIcon
                                                                        className={`w-6 h-6 text-${typeConfig.color}-600`}
                                                                    />
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-2">
                                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                                            {typeConfig.label} ({message.totalRecipients}名宛)
                                                                        </h3>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={`bg-${typeConfig.color}-50 text-${typeConfig.color}-700`}
                                                                        >
                                                                            {typeConfig.label}
                                                                        </Badge>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className={
                                                                                statusConfig.color
                                                                            }
                                                                        >
                                                                            {statusConfig.label}
                                                                        </Badge>
                                                                    </div>

                                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                                        {message.content}
                                                                    </p>

                                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                        <div className="flex items-center space-x-1">
                                                                            <Users className="w-4 h-4" />
                                                                            <span>{message.totalRecipients}名</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Eye className="w-4 h-4" />
                                                                            <span>
                                                                                既読率 {Math.round((message.readCount / message.totalRecipients) * 100)}%
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Clock className="w-4 h-4" />
                                                                            <span>
                                                                                {message.scheduledAt
                                                                                    ? `予約: ${new Date(message.scheduledAt).toLocaleString('ja-JP')}`
                                                                                    : `送信: ${new Date(message.sentAt).toLocaleString('ja-JP')}`}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className='cursor-pointer'
                                                                        onClick={(e) =>
                                                                            e.stopPropagation()
                                                                        }
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>
                                                                        アクション
                                                                    </DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleViewDetails(message);
                                                                        }}
                                                                        className='cursor-pointer'
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        詳細を見る
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditMessage(message);
                                                                        }}
                                                                        className='cursor-pointer'
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        編集
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteMessage(message);
                                                                        }}
                                                                        className="text-red-600 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        削除
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>

                                        {filteredMessages.length === 0 && (
                                            <div className="text-center py-8">
                                                <Mail className="mx-auto h-12 w-12 text-gray-300" />
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                                    メッセージが見つかりません
                                                </h3>
                                                <p className="mt-1 text-gray-500">
                                                    検索条件に一致するメッセージがありません。新しいメッセージを作成してください。
                                                </p>
                                                <Button
                                                    className="mt-4 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                                    asChild
                                                >
                                                    <Link href="/admin/messages/create">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        メッセージ作成
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>
                    </div>
                </main>
            </PageTransition>

            {/* メッセージ詳細ダイアログ */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    {selectedMessage && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {(() => {
                                        const config = getTypeConfig(selectedMessage.messageType || 'announcement');
                                        const Icon = config.icon;
                                        return (
                                            <Icon className={`w-5 h-5 text-${config.color}-600`} />
                                        );
                                    })()}
                                    メッセージ詳細
                                </DialogTitle>
                                <DialogDescription>
                                    メッセージの詳細情報と配信状況
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            {(() => {
                                                const typeConfig = getTypeConfig(
                                                    selectedMessage.messageType || 'announcement'
                                                );
                                                const status = selectedMessage.scheduledAt ? 'scheduled' : 'sent';
                                                const statusConfig = getStatusConfig(status);
                                                return (
                                                    <>
                                                        <Badge
                                                            variant="outline"
                                                            className={`bg-${typeConfig.color}-50 text-${typeConfig.color}-700`}
                                                        >
                                                            {typeConfig.label}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className={statusConfig.color}
                                                        >
                                                            {statusConfig.label}
                                                        </Badge>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(selectedMessage.sentAt).toLocaleString('ja-JP')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {getTypeConfig(selectedMessage.messageType || 'announcement').label} ({selectedMessage.totalRecipients}名宛)
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap mb-4">
                                        {selectedMessage.content}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                                        <div>
                                            <p className="text-sm text-gray-500">送信対象</p>
                                            <p className="font-medium">
                                                {selectedMessage.totalRecipients}名
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">既読率</p>
                                            <p className="font-medium">
                                                {Math.round((selectedMessage.readCount / selectedMessage.totalRecipients) * 100)}% ({selectedMessage.readCount}/{selectedMessage.totalRecipients})
                                            </p>
                                        </div>
                                        {selectedMessage.scheduledAt && (
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">送信予定</p>
                                                <p className="font-medium">
                                                    {new Date(selectedMessage.scheduledAt).toLocaleString('ja-JP')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* 受信者一覧 */}
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-500 mb-2">受信者一覧</p>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {selectedMessage.recipients?.map((recipient: { studentName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; studentGrade: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; isRead: any; }, index: Key | null | undefined) => (
                                                <div key={index} className="flex items-center justify-between text-xs">
                                                    <span>{recipient.studentName} ({recipient.studentGrade})</span>
                                                    <span className={`px-2 py-1 rounded ${recipient.isRead ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {recipient.isRead ? '既読' : '未読'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* 削除確認モーダル */}
            {messageToDelete && (
                <DeleteMessageModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setMessageToDelete(null);
                    }}
                    onConfirm={confirmDeleteMessage}
                    isDeleting={isDeleting}
                    messageContent={messageToDelete.content}
                    recipientCount={messageToDelete.totalRecipients}
                />
            )}

            {/* 編集モーダル */}
            {messageToEdit && (
                <EditMessageModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setMessageToEdit(null);
                    }}
                    onSave={saveEditMessage}
                    isSaving={isSaving}
                    initialData={{
                        content: messageToEdit.content,
                        messageType: messageToEdit.messageType,
                        messagePriority: messageToEdit.messagePriority,
                        scheduledAt: messageToEdit.scheduledAt || '',
                        recipientCount: messageToEdit.totalRecipients,
                    }}
                />
            )}
        </div>
    );
}