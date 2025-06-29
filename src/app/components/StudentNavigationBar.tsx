'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Badge from '@mui/material/Badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Home, Dumbbell, Settings, LogOut, User } from 'lucide-react';
import { GoBell } from 'react-icons/go';
import { motion, MotionConfig } from 'framer-motion';
import { LogoutConfirmDialog } from './StudentLogoutConfirmModal';
import Loading from '../loading';
import { useSession } from '../hook/useSession';

export function StudentNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const { isAuthenticated, loading } = useSession();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/');
        }
    }, [loading, isAuthenticated, router]);

    const navigationItems = [
        { id: 'dashboard', label: 'トップ', icon: Home, href: '/student/dashboard' },
        { id: 'training', label: 'トレーニング', icon: Dumbbell, href: '/student/training' },
        { id: 'setting', label: '設定', icon: Settings, href: '/student/setting' },
    ];

    const navigateTo = (href: string) => {
        router.push(href);
        setIsMobileMenuOpen(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* ロゴ */}
                        <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => router.push('/student/dashboard')}
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">VocabMaster</h1>
                                <p className="text-xs text-gray-500">Student Portal</p>
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
                                        onClick={() => navigateTo(item.href)}
                                        layout
                                        transition={{ type: 'spring', stiffness: 400, damping: 50 }}
                                        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer duration-200 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-highlight"
                                                className="absolute inset-0 bg-blue-600 rounded-lg z-0"
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
                            {/* 通知アイコン（未読バッジ付き） */}
                            <div className="relative cursor-pointer">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="relative p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                                    onClick={() =>
                                        navigateTo(
                                            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/student/message`
                                        )
                                    }
                                >
                                    <Badge badgeContent={3} color="error">
                                        <GoBell className="w-6 h-6 text-gray-700" />
                                    </Badge>
                                </motion.button>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 p-2 cursor-pointer"
                                    >
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-medium text-gray-900">
                                                田中太郎
                                            </p>
                                            <p className="text-xs text-gray-500">高校2年生</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                        <User className="w-4 h-4 mr-2" />
                                        プロフィール
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            navigateTo(
                                                `${process.env.NEXT_PUBLIC_APP_BASE_URL}/student/setting`
                                            )
                                        }
                                        className="cursor-pointer"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        設定
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setIsModalOpen(true)}
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
                                            onClick={() => navigateTo(item.href)}
                                            variant={isActive ? 'default' : 'ghost'}
                                            className={`w-full justify-start space-x-2 ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
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
            <LogoutConfirmDialog open={isModalOpen} onOpenChange={setIsModalOpen} />
        </>
    );
}

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
