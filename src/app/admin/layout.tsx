/* 管理者側のレイアウト設定ファイル */

import { AuthProvider } from '../context/AdminAuthContext';
import { AdminMessagesProvider } from '../context/AdminMessagesContext';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminMessagesProvider>{children}</AdminMessagesProvider>
        </AuthProvider>
    );
}
