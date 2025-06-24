/* バリデーションスキーマ */

import { z } from 'zod';

// 管理者のパスワード再設定用のバリデーションスキーマ
export const adminForgetPasswordValidation = z
    .object({
        password: z
            .string()
            .min(8, '8文字以上必要です')
            .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '大文字・小文字・数字を含めてください'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'パスワードが一致しません',
    });

export type adminForgetPasswordFormData = z.infer<typeof adminForgetPasswordValidation>;
