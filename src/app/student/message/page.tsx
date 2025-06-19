'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Mail,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Eye,
    EyeOff,
    Bell,
    User,
    BookOpen,
    Award,
    Clock,
    Star,
} from 'lucide-react';
import { StudentNavigation } from '../../components/StudentNavigationBar';
import {
    PageTransition,
    StaggerContainer,
    FadeIn,
    SoftFadeIn,
} from '../../components/page-transition';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    type: 'announcement' | 'personal' | 'system' | 'achievement';
    title: string;
    content: string;
    sender: string;
    senderAvatar?: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
}

const mockMessages: Message[] = [
    {
        id: '1',
        type: 'announcement',
        title: '新機能リリースのお知らせ',
        content:
            'VocabMasterに新しい学習モード「リスニングチャレンジ」が追加されました。ネイティブスピーカーの発音を聞いて、正しい単語を選択する新しい学習体験をお楽しみください。',
        sender: 'VocabMaster運営チーム',
        timestamp: '2024年12月6日 14:30',
        isRead: false,
        priority: 'high',
    },
    {
        id: '2',
        type: 'personal',
        title: '学習進捗について',
        content:
            '田中さん、こんにちは！最近の学習進捗を確認させていただきました。特に動詞の活用で素晴らしい成果を上げていますね。この調子で頑張ってください。何かご質問があればいつでもお声かけください。',
        sender: '山田先生',
        senderAvatar: '/placeholder.svg?height=40&width=40',
        timestamp: '2024年12月5日 16:45',
        isRead: false,
        priority: 'medium',
    },
    {
        id: '3',
        type: 'achievement',
        title: '🎉 1000単語達成おめでとうございます！',
        content:
            '素晴らしい成果です！累計1000単語の学習を達成されました。継続的な努力が実を結んでいますね。次の目標は1500単語です。引き続き頑張ってください！',
        sender: 'VocabMaster',
        timestamp: '2024年12月3日 10:15',
        isRead: true,
        priority: 'high',
    },
    {
        id: '4',
        type: 'system',
        title: '週間学習レポート',
        content:
            '今週の学習統計：学習時間 2.5時間、新規単語 45個、正答率 87%。先週と比較して正答率が5%向上しています。素晴らしい進歩です！',
        sender: 'システム',
        timestamp: '2024年12月2日 09:00',
        isRead: true,
        priority: 'low',
    },
    {
        id: '5',
        type: 'announcement',
        title: 'メンテナンスのお知らせ',
        content:
            '12月10日（日）午前2:00〜4:00の間、システムメンテナンスを実施いたします。この間、一時的にサービスをご利用いただけません。ご不便をおかけして申し訳ございません。',
        sender: 'VocabMaster運営チーム',
        timestamp: '2024年12月1日 18:00',
        isRead: true,
        priority: 'medium',
    },
];

const messageTypeConfig = {
    announcement: {
        icon: Bell,
        color: 'blue',
        label: 'お知らせ',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        iconColor: 'text-blue-600',
    },
    personal: {
        icon: User,
        color: 'green',
        label: '個人メッセージ',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        iconColor: 'text-green-600',
    },
    system: {
        icon: BookOpen,
        color: 'gray',
        label: 'システム',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        iconColor: 'text-gray-600',
    },
    achievement: {
        icon: Award,
        color: 'yellow',
        label: '成果',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        iconColor: 'text-yellow-600',
    },
};

export default function MessagesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const unreadCount = messages.filter((msg) => !msg.isRead).length;

    const filteredMessages = messages.filter((message) => {
        const matchesType = selectedType === 'all' || message.type === selectedType;
        const matchesSearch =
            message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.sender.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const markAsRead = (messageId: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
        );
    };

    const deleteMessage = (messageId: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    };

    const toggleReadStatus = (messageId: string) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: !msg.isRead } : msg))
        );
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500';
            case 'medium':
                return 'border-l-yellow-500';
            default:
                return 'border-l-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavigation />
            <PageTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        {/* ヘッダー */}
                        <FadeIn delay={0.1}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                        className="text-3xl font-bold text-gray-900 mb-2"
                                    >
                                        メッセージ
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-gray-600"
                                    >
                                        お知らせや個人メッセージを確認しましょう
                                    </motion.p>
                                </div>
                                {unreadCount > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                                    >
                                        <Badge className="bg-red-100 text-red-700 px-3 py-1">
                                            {unreadCount}件の未読メッセージ
                                        </Badge>
                                    </motion.div>
                                )}
                            </div>
                        </FadeIn>

                        {/* 検索とフィルター */}
                        <SoftFadeIn delay={0.2}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input
                                                placeholder="メッセージを検索..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Filter className="w-4 h-4" />
                                                    <span>
                                                        {selectedType === 'all'
                                                            ? 'すべて'
                                                            : messageTypeConfig[
                                                                  selectedType as keyof typeof messageTypeConfig
                                                              ]?.label}
                                                    </span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    メッセージタイプ
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setSelectedType('all')}
                                                >
                                                    すべて
                                                </DropdownMenuItem>
                                                {Object.entries(messageTypeConfig).map(
                                                    ([type, config]) => (
                                                        <DropdownMenuItem
                                                            key={type}
                                                            onClick={() => setSelectedType(type)}
                                                        >
                                                            <config.icon className="w-4 h-4 mr-2" />
                                                            {config.label}
                                                        </DropdownMenuItem>
                                                    )
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>

                        {/* メッセージ一覧 */}
                        <StaggerContainer>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {filteredMessages.map((message, index) => {
                                        const config = messageTypeConfig[message.type];
                                        const Icon = config.icon;

                                        return (
                                            <motion.div
                                                key={message.id}
                                                variants={{
                                                    hidden: { opacity: 0 },
                                                    visible: { opacity: 1 },
                                                }}
                                                exit={{ opacity: 0 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            >
                                                <Card
                                                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${getPriorityColor(
                                                        message.priority
                                                    )} ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start space-x-4 flex-1">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bgColor}`}
                                                                >
                                                                    <Icon
                                                                        className={`w-6 h-6 ${config.iconColor}`}
                                                                    />
                                                                </motion.div>

                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h3
                                                                            className={`font-semibold text-gray-900 ${
                                                                                !message.isRead
                                                                                    ? 'font-bold'
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            {message.title}
                                                                        </h3>
                                                                        {!message.isRead && (
                                                                            <motion.div
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                    scale: 0,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                    scale: 1,
                                                                                }}
                                                                                transition={{
                                                                                    duration: 0.3,
                                                                                    ease: 'easeOut',
                                                                                }}
                                                                                className="w-2 h-2 bg-blue-600 rounded-full"
                                                                            />
                                                                        )}
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className={`${config.bgColor} ${config.textColor} border-0`}
                                                                        >
                                                                            {config.label}
                                                                        </Badge>
                                                                    </div>

                                                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                        {message.content}
                                                                    </p>

                                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                        <div className="flex items-center space-x-1">
                                                                            {message.senderAvatar ? (
                                                                                <Avatar className="w-4 h-4">
                                                                                    <AvatarImage
                                                                                        src={
                                                                                            message.senderAvatar ||
                                                                                            '/placeholder.svg'
                                                                                        }
                                                                                        alt={
                                                                                            message.sender
                                                                                        }
                                                                                    />
                                                                                    <AvatarFallback className="text-xs">
                                                                                        {message.sender.charAt(
                                                                                            0
                                                                                        )}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                            ) : (
                                                                                <User className="w-4 h-4" />
                                                                            )}
                                                                            <span>
                                                                                {message.sender}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Clock className="w-4 h-4" />
                                                                            <span>
                                                                                {message.timestamp}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center space-x-2">
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <motion.div
                                                                            whileHover={{
                                                                                scale: 1.02,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.98,
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setSelectedMessage(
                                                                                        message
                                                                                    );
                                                                                    if (
                                                                                        !message.isRead
                                                                                    ) {
                                                                                        markAsRead(
                                                                                            message.id
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            >
                                                                                詳細を見る
                                                                            </Button>
                                                                        </motion.div>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-2xl">
                                                                        <DialogHeader>
                                                                            <div className="flex items-center space-x-3 mb-2">
                                                                                <div
                                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
                                                                                >
                                                                                    <Icon
                                                                                        className={`w-5 h-5 ${config.iconColor}`}
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <DialogTitle className="text-xl">
                                                                                        {
                                                                                            message.title
                                                                                        }
                                                                                    </DialogTitle>
                                                                                    <DialogDescription className="flex items-center space-x-4 mt-1">
                                                                                        <span>
                                                                                            {
                                                                                                message.sender
                                                                                            }
                                                                                        </span>
                                                                                        <span>
                                                                                            •
                                                                                        </span>
                                                                                        <span>
                                                                                            {
                                                                                                message.timestamp
                                                                                            }
                                                                                        </span>
                                                                                    </DialogDescription>
                                                                                </div>
                                                                            </div>
                                                                        </DialogHeader>
                                                                        <div className="mt-4">
                                                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                                                {message.content}
                                                                            </p>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <motion.div
                                                                            whileHover={{
                                                                                scale: 1.02,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.98,
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                            >
                                                                                <MoreVertical className="w-4 h-4" />
                                                                            </Button>
                                                                        </motion.div>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                toggleReadStatus(
                                                                                    message.id
                                                                                )
                                                                            }
                                                                        >
                                                                            {message.isRead ? (
                                                                                <>
                                                                                    <EyeOff className="w-4 h-4 mr-2" />
                                                                                    未読にする
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                                    既読にする
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger
                                                                                asChild
                                                                            >
                                                                                <DropdownMenuItem
                                                                                    onSelect={(e) =>
                                                                                        e.preventDefault()
                                                                                    }
                                                                                    className="text-red-600"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                                    削除
                                                                                </DropdownMenuItem>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>
                                                                                        メッセージを削除しますか？
                                                                                    </AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        この操作は取り消すことができません。メッセージが完全に削除されます。
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>
                                                                                        キャンセル
                                                                                    </AlertDialogCancel>
                                                                                    <AlertDialogAction
                                                                                        onClick={() =>
                                                                                            deleteMessage(
                                                                                                message.id
                                                                                            )
                                                                                        }
                                                                                        className="bg-red-600 hover:bg-red-700"
                                                                                    >
                                                                                        削除
                                                                                    </AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {filteredMessages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.6 }}
                                        className="text-center py-12"
                                    >
                                        <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            メッセージがありません
                                        </h3>
                                        <p className="text-gray-500">
                                            {searchQuery || selectedType !== 'all'
                                                ? '検索条件に一致するメッセージが見つかりませんでした'
                                                : '新しいメッセージが届くとここに表示されます'}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </StaggerContainer>

                        {/* 統計情報 */}
                        <FadeIn delay={0.3}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-yellow-600" />
                                        <span>メッセージ統計</span>
                                    </CardTitle>
                                    <CardDescription>
                                        メッセージの概要を確認できます
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            {
                                                label: '総メッセージ数',
                                                value: messages.length,
                                                color: 'blue',
                                            },
                                            { label: '未読', value: unreadCount, color: 'red' },
                                            {
                                                label: 'お知らせ',
                                                value: messages.filter(
                                                    (m) => m.type === 'announcement'
                                                ).length,
                                                color: 'green',
                                            },
                                            {
                                                label: '個人メッセージ',
                                                value: messages.filter((m) => m.type === 'personal')
                                                    .length,
                                                color: 'purple',
                                            },
                                        ].map((stat, index) => (
                                            <motion.div
                                                key={stat.label}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.4 + index * 0.1,
                                                    duration: 0.6,
                                                }}
                                                className="text-center p-4 bg-gray-50 rounded-lg"
                                            >
                                                <p
                                                    className={`text-2xl font-bold text-${stat.color}-600`}
                                                >
                                                    {stat.value}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {stat.label}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </main>
            </PageTransition>
        </div>
    );
}
