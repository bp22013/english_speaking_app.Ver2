/* 各生徒の情報や統計を表示するページ */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Mail,
    Calendar,
    BookOpen,
    Target,
    TrendingUp,
    Eye,
    UserPlus,
    Upload,
    ArrowUpDown,
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import {
    PageTransition,
    FadeIn,
    SoftFadeIn,
    StaggerContainer,
} from '../../components/page-transition';
import { StudentDataDownload } from '@/app/components/studentDataDownloadButton';
import Loading from '@/app/loading';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/HonoClient';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { StudentActionDropdown } from '@/app/components/StudentActionDropdown';
import { StudentEditModal } from '@/app/components/StudentEditModal';

// 生徒データの型定義
interface Student {
    studentId: string;
    name: string;
    grade: string | null;
    lastLoginAt: string | null;
    registeredAt: string | null;
    isActive: boolean;
}

const grades = ['中学1年生', '中学2年生', '中学3年生', '高校1年生', '高校2年生', '高校3年生'];

export default function AdminStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    const router = useRouter();

    // 生徒情報を取得
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoading(true);
                const res = await client.api.auth.getStudentInfo.$get();

                if (res.ok) {
                    const data = await res.json();
                    setStudents(data.sessions);
                } else {
                }
            } catch (error) {
                toast.error('生徒情報を取得できませんでした');
                router.push(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/dashboard`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // フィルタリングと並び替え
    const filteredStudents = students
        .filter((student) => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (student.grade ?? '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
            const matchesStatus =
                selectedStatus === 'all' ||
                (selectedStatus === 'active' && student.isActive) ||
                (selectedStatus === 'inactive' && !student.isActive);

            return matchesSearch && matchesGrade && matchesStatus;
        })
        .sort((a, b) => {
            if (sortField === 'name') {
                return sortDirection === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            // if (sortField === 'progress') {
            //     return sortDirection === 'asc'
            //         ? a.progress.totalWords - b.progress.totalWords
            //         : b.progress.totalWords - a.progress.totalWords;
            // }
            else if (sortField === 'lastActive') {
                const aTime = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
                const bTime = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
                return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
            }
            return 0;
        });

    // Selectの情報をソート
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 生徒の詳細のモーダルを開く
    const handleViewStudentDetails = (student: Student) => {
        setSelectedStudent(student);
        setIsDetailOpen(true);
    };

    // 生徒の編集モーダルを開く
    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsEditOpen(true);
    };

    // 生徒を削除
    const handleDeleteStudent = async (studentId: string) => {
        setIsLoading(true);

        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const res = await client.api.auth.deleteStudent.$post({
                        json: { studentId },
                    });

                    const data = await res.json();

                    if (data.flg) {
                        resolve(data.message);
                        window.location.reload();
                    } else {
                        reject(data.message);
                    }
                } catch (error) {
                    reject(`不明なエラーが発生しました: ${error}`);
                } finally {
                    setIsLoading(false);
                }
            }),
            {
                loading: '対象の生徒を削除しています...',
                success: '対象の生徒を削除しました!',
                error: (message: string) => message,
            }
        );
    };

    const getStatusConfig = (status: boolean): { label: string; color: string } => {
        return status
            ? {
                  label: 'アクティブ',
                  color: 'bg-green-100 text-green-700 border-green-200',
              }
            : {
                  label: '非アクティブ',
                  color: 'bg-gray-100 text-gray-700 border-gray-200',
              };
    };

    /*const handleStatusChange = (studentId: string, newStatus: 'active' | 'inactive') => {
        setStudents(
            students.map((student) =>
                student.studentId === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const getProgressColor = (rate: number) => {
        if (rate >= 80) return 'text-green-600';
        if (rate >= 60) return 'text-yellow-600';
        return 'text-red-600';
    }; */

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavigation currentPage="students" />
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
                                        生徒管理
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                        className="text-gray-600"
                                    >
                                        登録されている生徒の管理と学習状況の確認
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mt-4 md:mt-0 flex space-x-3"
                                >
                                    <StudentDataDownload data={students} />
                                    <Button variant="outline" className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        インポート
                                    </Button>
                                    <Button
                                        className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                        onClick={() => router.push('/admin/student/create')}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        生徒を追加
                                    </Button>
                                </motion.div>
                            </div>
                        </FadeIn>

                        {/* 統計カード */}
                        <StaggerContainer>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    {
                                        title: '総生徒数',
                                        value: students.length.toString(),
                                        icon: Users,
                                        color: 'blue',
                                    },
                                    {
                                        title: 'アクティブ',
                                        value: students
                                            .filter((s) => s.isActive === true)
                                            .length.toString(),
                                        icon: Target,
                                        color: 'green',
                                    },
                                    {
                                        title: '平均学習単語数',
                                        value: Math.round(
                                            /*
                                            students.reduce(
                                                (sum, s) => sum + s.progress.totalWords,
                                                0
                                            ) / students.length
                                             */
                                            0
                                        ).toString(),
                                        icon: BookOpen,
                                        color: 'purple',
                                    },
                                    {
                                        title: '平均正答率',
                                        value: `${Math.round(
                                            /*
                                            students.reduce(
                                                (sum, s) => sum + s.progress.correctRate,
                                                0
                                            ) / students.length
                                             */
                                            0
                                        )}%`,
                                        icon: TrendingUp,
                                        color: 'yellow',
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
                                                placeholder="生徒を検索..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Select
                                                value={selectedGrade}
                                                onValueChange={setSelectedGrade}
                                            >
                                                <SelectTrigger className="w-[150px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedGrade === 'all'
                                                                ? '全ての学年'
                                                                : selectedGrade}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="all"
                                                        className="cursor-pointer"
                                                    >
                                                        全ての学年
                                                    </SelectItem>
                                                    {grades.map((grade) => (
                                                        <SelectItem
                                                            key={grade}
                                                            value={grade}
                                                            className="cursor-pointer"
                                                        >
                                                            {grade}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={selectedStatus}
                                                onValueChange={setSelectedStatus}
                                            >
                                                <SelectTrigger className="w-[178px] cursor-pointer">
                                                    <div className="flex items-center">
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        <span>
                                                            {selectedStatus === 'all'
                                                                ? '全てのステータス'
                                                                : selectedStatus === 'active'
                                                                ? 'アクティブ'
                                                                : '非アクティブ'}
                                                        </span>
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="all"
                                                        className="cursor-pointer"
                                                    >
                                                        全てのステータス
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="active"
                                                        className="cursor-pointer"
                                                    >
                                                        アクティブ
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="inactive"
                                                        className="cursor-pointer"
                                                    >
                                                        非アクティブ
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </SoftFadeIn>

                        {/* 生徒一覧 */}
                        <SoftFadeIn delay={0.3}>
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center space-x-2">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <span>生徒一覧</span>
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">
                                            {filteredStudents.length} / {students.length} 件表示
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('name')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>生徒</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                                        学年
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                                        ステータス
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('progress')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>学習進捗</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                                                        onClick={() => handleSort('lastActive')}
                                                    >
                                                        <div className="flex items-center">
                                                            <span>最終アクティブ</span>
                                                            <ArrowUpDown className="ml-1 h-4 w-4" />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                                                        アクション
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <AnimatePresence>
                                                    {filteredStudents.map((student) => {
                                                        const statusConfig = getStatusConfig(
                                                            student.isActive
                                                        );
                                                        return (
                                                            <motion.tr
                                                                key={student.studentId}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="border-b border-gray-100 hover:bg-gray-50"
                                                            >
                                                                <td className="px-4 py-4">
                                                                    <div className="flex items-center space-x-3">
                                                                        <Avatar className="w-10 h-10">
                                                                            <AvatarImage
                                                                                src={
                                                                                    '/placeholder.svg'
                                                                                }
                                                                                alt={student.name}
                                                                            />
                                                                            <AvatarFallback className="bg-purple-100 text-purple-600">
                                                                                {student.name.charAt(
                                                                                    0
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">
                                                                                {student.name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {student.studentId}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">
                                                                            {student.grade}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={
                                                                            statusConfig.color
                                                                        }
                                                                    >
                                                                        {statusConfig.label}
                                                                    </Badge>
                                                                </td>
                                                                <td className="px-4 py-4">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center justify-between text-sm">
                                                                            {/*
                                                                            <span>
                                                                                単語数:{' '}
                                                                                {
                                                                                    //student.progress
                                                                                    //    .totalWords
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className={`font-medium ${getProgressColor(
                                                                                    student.progress
                                                                                        .correctRate
                                                                                )}`}
                                                                            >
                                                                                {
                                                                                    student.progress
                                                                                        .correctRate
                                                                                }
                                                                                %
                                                                            </span>
                                                                             */}
                                                                        </div>
                                                                        {/*
                                                                        <Progress
                                                                            value={
                                                                                student.progress
                                                                                   .correctRate
                                                                            }
                                                                            className="h-2"
                                                                        />
                                                                        */}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span>
                                                                        {student.lastLoginAt
                                                                            ? dayjs(
                                                                                  student.lastLoginAt
                                                                              ).format(
                                                                                  'YYYY/MM/DD HH:mm'
                                                                              )
                                                                            : '不明'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-right">
                                                                    <StudentActionDropdown
                                                                        studentId={
                                                                            student.studentId
                                                                        }
                                                                        studentName={student.name}
                                                                        grade={student.grade}
                                                                        onViewDetails={() =>
                                                                            handleViewStudentDetails(
                                                                                student
                                                                            )
                                                                        }
                                                                        onDelete={() =>
                                                                            handleDeleteStudent(
                                                                                student.studentId
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </motion.tr>
                                                        );
                                                    })}
                                                </AnimatePresence>
                                            </tbody>
                                        </table>

                                        {filteredStudents.length === 0 && (
                                            <div className="text-center py-8">
                                                <Users className="mx-auto h-12 w-12 text-gray-300" />
                                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                                    生徒が見つかりません
                                                </h3>
                                                <p className="mt-1 text-gray-500">
                                                    検索条件に一致する生徒がありません。新しい生徒を追加してください。
                                                </p>
                                                <Button
                                                    className="mt-4 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                                    onClick={() =>
                                                        router.push(
                                                            `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/student/create`
                                                        )
                                                    }
                                                >
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    生徒を追加
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

            {/* 生徒詳細ダイアログ */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl max-h-[120vh] overflow-y-auto">
                    {selectedStudent && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={'/placeholder.svg'}
                                            alt={selectedStudent.name}
                                        />
                                        <AvatarFallback className="bg-purple-100 text-purple-600">
                                            {selectedStudent.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {selectedStudent.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedStudent.grade}
                                        </p>
                                    </div>
                                </DialogTitle>
                                <DialogDescription>生徒の詳細情報と学習状況</DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="overview" className="mt-4">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="overview" className="cursor-pointer">
                                        概要
                                    </TabsTrigger>
                                    <TabsTrigger value="progress" className="cursor-pointer">
                                        学習進捗
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4">
                                    {/*
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            {
                                                label: '学習単語数',
                                                value: selectedStudent.progress.totalWords.toString(),
                                                icon: BookOpen,
                                                color: 'blue',
                                            },
                                            {
                                                label: '正答率',
                                                value: `${selectedStudent.progress.correctRate}%`,
                                                icon: Target,
                                                color: 'green',
                                            },
                                            {
                                                label: '学習時間',
                                                value: `${selectedStudent.progress.studyTime}時間`,
                                                icon: Clock,
                                                color: 'purple',
                                            },
                                            {
                                                label: '連続日数',
                                                value: `${selectedStudent.progress.streak}日`,
                                                icon: Award,
                                                color: 'yellow',
                                            },
                                        ].map((stat) => {
                                            const Icon = stat.icon;
                                            return (
                                                <div
                                                    key={stat.label}
                                                    className="text-center p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div
                                                        className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}
                                                    >
                                                        <Icon
                                                            className={`w-6 h-6 text-${stat.color}-600`}
                                                        />
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {stat.value}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {stat.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900">基本情報</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">生徒ID:　</span>
                                                    <span className="text-black">
                                                        {selectedStudent.studentId}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">登録日:　</span>
                                                    <span>
                                                        {selectedStudent.registeredAt
                                                            ? dayjs(
                                                                  selectedStudent.registeredAt
                                                              ).format('YYYY/MM/DD HH:mm')
                                                            : '不明'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        最終アクティブ:　
                                                    </span>
                                                    <span>
                                                        {selectedStudent?.lastLoginAt
                                                            ? dayjs(
                                                                  selectedStudent.lastLoginAt
                                                              ).format('YYYY/MM/DD HH:mm')
                                                            : '不明'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        ステータス:
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            getStatusConfig(
                                                                selectedStudent.isActive
                                                            ).color
                                                        }
                                                    >
                                                        {
                                                            getStatusConfig(
                                                                selectedStudent.isActive
                                                            ).label
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900">学習統計</h4>
                                            <div className="space-y-2">
                                                <div>
                                                    {/*
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>正答率</span>
                                                        <span
                                                            className={getProgressColor(
                                                                selectedStudent.progress.correctRate
                                                            )}
                                                        >
                                                            {selectedStudent.progress.correctRate}%
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={selectedStudent.progress.correctRate}
                                                        className="h-2"
                                                    />
                                                    */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                                onClick={() =>
                                                    router.push(
                                                        `${process.env.NEXT_PUBLIC_APP_BASE_URL}/admin/messages`
                                                    )
                                                }
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                メッセージ送信
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="cursor-pointer"
                                                onClick={() => setIsEditOpen(true)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                編集
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="progress" className="space-y-4">
                                    <div className="text-center">
                                        <p className="text-gray-500">
                                            詳細な学習進捗データは開発中です
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            グラフやチャートによる可視化を予定しています
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <StudentEditModal
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                studentId={selectedStudent?.studentId as string}
                studentName={selectedStudent?.name as string}
                grade={selectedStudent?.grade as string}
            />
        </div>
    );
}
