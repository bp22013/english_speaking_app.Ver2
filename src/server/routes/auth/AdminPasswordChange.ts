/* 管理者のパスワード更新用API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { admins } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createClient } from '@/lib/supabase/server';

export const updateAdminPassword = new Hono().post('/updateAdminPassword', async (c) => {
    const supabase = await createClient();
    const salt = Number(process.env.SALT_HASH);

    try {
        const { email, currentPassword, newPassword } = await c.req.json();

        if (!email || !currentPassword || !newPassword) {
            return c.json({ flg: false, message: '全ての項目を入力してください' }, 400);
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword,
        });

        if (authError || !authData.session) {
            return c.json({ flg: false, message: '現在のパスワードが正しくありません' }, 400);
        }

        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        if (updateError) {
            console.error('パスワード更新エラー:', updateError);
            return c.json({ flg: false, message: 'パスワードの更新に失敗しました' }, 500);
        }

        const adminRecord = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

        if (adminRecord.length > 0) {
            await db
                .update(admins)
                .set({ lastPasswordChangeAt: new Date(), passwordHash: hashedNewPassword })
                .where(eq(admins.email, email));
        }

        return c.json({ flg: true, message: 'パスワードを更新しました' }, 200);
    } catch (error) {
        console.error('管理者パスワード更新エラー:', error);
        return c.json({ flg: false, message: 'サーバーエラーが発生しました' }, 500);
    }
});
