/* 生徒用レイアウト設定ファイル（認証を生徒のみに被せるため） */

import { AuthProvider } from '../context/AuthContext';
import { StudentMessagesProvider } from '../context/StudentMessage';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>
                <StudentMessagesProvider>{children}</StudentMessagesProvider>
            </AuthProvider>
        </>
    );
}
