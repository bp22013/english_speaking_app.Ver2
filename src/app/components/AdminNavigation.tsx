/* 管理者用ナビゲーションバーコンポーネント */

'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, LayoutDashboard, Users, Mail, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { logout } from '@/lib/supabase/action';
import toast from 'react-hot-toast';

interface AdminNavigationProps {
    currentPage: string;
}

export const AdminNavigation = ({ currentPage }: AdminNavigationProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'ホーム',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
        },
        { id: 'vocabulary', label: '単語管理', icon: BookOpen, href: '/admin/vocabulary' },
        { id: 'student', label: '生徒管理', icon: Users, href: '/admin/student' },
        { id: 'messages', label: 'メッセージ', icon: Mail, href: '/admin/messages' },
        { id: 'setting', label: '設定', icon: Settings, href: '/admin/setting' },
    ];

    const navigateTo = (href: string) => {
        router.push(href);
        setIsMobileMenuOpen(false);
    };

    // ログアウト処理（サーバーアクションを使用）
    const handleLogout = async () => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    setIsLoading(true);
                    const result = await logout();

                    if (result.success) {
                        resolve(result.message);
                        router.push('/');
                    } else {
                        reject(result.error);
                    }
                } catch (error) {
                    reject('不明なエラーが発生しました');
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: 'ログアウト中です...',
                success: 'ログアウトしました!',
                error: (message: string) => message,
            }
        );
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* ロゴ */}
                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => router.push('/admin/dashboard')}
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">VocabMaster</h1>
                            <p className="text-xs text-gray-500">Admin Portal</p>
                        </div>
                    </div>

                    {/* デスクトップナビゲーション */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <motion.button
                                    key={item.id}
                                    disabled={isLoading}
                                    onClick={() => navigateTo(item.href)}
                                    layout
                                    transition={{ type: 'spring', stiffness: 400, damping: 50 }}
                                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer duration-200 ${
                                        isActive
                                            ? 'bg-purple-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-highlight"
                                            className="absolute inset-0 bg-purple-600 rounded-lg z-0"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 400,
                                                damping: 50,
                                            }}
                                        />
                                    )}
                                    <div className="relative z-10 flex items-center space-x-2">
                                        <Icon className="w-4 h-4" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* ユーザーメニュー & モバイルボタン */}
                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-2 p-2 cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900">管理者</p>
                                        <p className="text-xs text-gray-500">システム管理者</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" disabled={isLoading}>
                                    <User className="w-4 h-4 mr-2" />
                                    プロフィール
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => navigateTo('/admin/setting')}
                                    className="cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    設定
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className="text-red-600 hover:!bg-red-100 focus:!text-red-600 cursor-pointer focus:!bg-red-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2 focus:!text-red-600" />
                                    ログアウト
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* アニメーション付きモバイルメニューボタン */}
                        <MotionConfig transition={{ duration: 0.5, ease: 'easeInOut' }}>
                            <motion.button
                                initial={false}
                                disabled={isLoading}
                                animate={isMobileMenuOpen ? 'open' : 'closed'}
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                className="relative w-10 h-10 md:hidden rounded-full bg-transparent"
                            >
                                <motion.span
                                    variants={VARIANTS.top}
                                    className="absolute h-0.5 w-6 bg-gray-700"
                                    style={{ top: '30%', left: '50%', x: '-50%', y: '-50%' }}
                                />
                                <motion.span
                                    variants={VARIANTS.middle}
                                    className="absolute h-0.5 w-6 bg-gray-700"
                                    style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
                                />
                                <motion.span
                                    variants={VARIANTS.bottom}
                                    className="absolute h-0.5 w-6 bg-gray-700"
                                    style={{ top: '70%', left: '50%', x: '-50%', y: '-50%' }}
                                />
                            </motion.button>
                        </MotionConfig>
                    </div>
                </div>

                {/* モバイルメニュー */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Button
                                        key={item.id}
                                        disabled={isLoading}
                                        onClick={() => navigateTo(item.href)}
                                        variant={isActive ? 'default' : 'ghost'}
                                        className={`w-full justify-start space-x-2 ${
                                            isActive
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const VARIANTS = {
    top: {
        open: {
            rotate: 45,
            y: 8,
        },
        closed: {
            rotate: 0,
            y: 0,
        },
    },
    middle: {
        open: {
            opacity: 0,
        },
        closed: {
            opacity: 1,
        },
    },
    bottom: {
        open: {
            rotate: -45,
            y: -8,
        },
        closed: {
            rotate: 0,
            y: 0,
        },
    },
};
