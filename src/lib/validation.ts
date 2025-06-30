/* 各ページのzodバリデーションスキーマ */

import { z } from 'zod';

// ログイン時の生徒のバリデーション
export const studentLoginValidation = z.object({
    studentId: z.string().nonempty('生徒IDは必須です'),
    studentPassword: z
        .string()
        .nonempty('パスワードを入力してください')
        .min(8, 'パスワードは8文字以上で入力してください'),
});

export type StudentLoginFormData = z.infer<typeof studentLoginValidation>;

// ログイン時の管理者のバリデーション
export const adminLoginValidation = z.object({
    email: z
        .string()
        .nonempty('メールアドレスを入力してください')
        .email('有効なメールアドレスを入力してください'),
    adminPassword: z
        .string()
        .nonempty('パスワードを入力してください')
        .min(8, 'パスワードは8文字以上で入力してください'),
});

export type AdminLoginFormData = z.infer<typeof adminLoginValidation>;

// 管理者のパスワード再設定用のバリデーションスキーマ
export const adminForgetPasswordValidation = z
    .object({
        password: z
            .string()
            .nonempty('パスワードを入力してください')
            .min(8, '8文字以上必要です')
            .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '大文字・小文字・数字を含めてください'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'パスワードが一致しません',
    });

export type adminForgetPasswordFormData = z.infer<typeof adminForgetPasswordValidation>;

// 管理者の新規生徒登録ページのバリデーション
export const adminStudentRegisterValidation = z
    .object({
        firstName: z.string().nonempty('名前（名）は必須です'),
        lastName: z.string().nonempty('名前（姓）は必須です'),
        grade: z.string().nonempty('学年は必須です'),
        studentId: z.string().nonempty('学籍番号は必須です'),
        password: z
            .string()
            .nonempty('パスワードは必須です')
            .min(8, 'パスワードは8文字以上で入力してください'),
        confirmPassword: z.string().nonempty('パスワードの再確認は必須です'),
        enrollmentDate: z.string().nonempty('日付は必須です'),
        notes: z.string().optional(),
        avatar: z
            .any()
            .refine((file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024), {
                message: 'ファイルサイズは5MB以下にしてください',
            })
            .refine((file) => !file || file.type.startsWith('image/'), {
                message: '画像ファイルのみアップロード可能です',
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'パスワードが一致しません',
        path: ['confirmPassword'],
    });

export type adminStudentRegisterFormData = z.infer<typeof adminStudentRegisterValidation>;

export const registerWordsValidation = z.object({
    word: z.string().nonempty('単語を入力してください'),
    meaning: z.string().nonempty('意味を入力してください'),
    difficulty: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
        errorMap: () => ({ message: '難易度を選択してください' }),
    }),
});

export type registerWordsDataForm = z.infer<typeof registerWordsValidation>;
