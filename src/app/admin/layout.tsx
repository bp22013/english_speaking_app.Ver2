/* 管理者側のレイアウト設定ファイル */
import { createClient } from '@/lib/supabase/server';
import { AuthProvider } from '../context/AdminAuthContext';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
