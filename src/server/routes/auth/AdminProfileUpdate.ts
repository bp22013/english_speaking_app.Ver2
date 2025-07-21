/* 管理者のプロフィール更新用API */

import { Hono } from 'hono';
import { db } from '@/server/db';
import { admins } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const updateAdminProfile = new Hono().post('/updateAdminProfile', async (c) => {
    try {
        const { adminId, name, email } = await c.req.json();

        // バリデーション
        if (!adminId) {
            return c.json({ flg: false, message: '管理者IDが必要です' }, 400);
        }
        if (!name || name.trim().length === 0) {
            return c.json({ flg: false, message: '名前が必要です' }, 400);
        }
        if (!email || !email.includes('@')) {
            return c.json({ flg: false, message: '有効なメールアドレスを入力してください' }, 400);
        }

        // 現在の管理者情報を取得
        const existingAdmin = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1);
        if (existingAdmin.length === 0) {
            return c.json({ flg: false, message: '管理者が見つかりません' }, 404);
        }

        // メールアドレスの重複チェック（自分以外）
        if (email !== existingAdmin[0].email) {
            const emailExists = await db
                .select()
                .from(admins)
                .where(eq(admins.email, email))
                .limit(1);

            if (emailExists.length > 0 && emailExists[0].id !== adminId) {
                return c.json(
                    { flg: false, message: 'このメールアドレスは既に使用されています' },
                    400
                );
            }
        }

        // プロフィール更新
        await db.update(admins).set({ name, email }).where(eq(admins.id, adminId));

        return c.json(
            {
                flg: true,
                message: 'プロフィールを更新しました',
                admin: { id: adminId, name, email },
            },
            200
        );
    } catch (error) {
        console.error('管理者プロフィール更新エラー:', error);
        return c.json({ flg: false, message: 'プロフィールの更新に失敗しました' }, 500);
    }
});
