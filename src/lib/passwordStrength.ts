/* パスワード強度を測定するライブラリ */

export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    width: string;
    message: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        longLength: password.length >= 12,
    };

    // 各条件をチェックしてスコアを計算
    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;
    if (checks.longLength) score += 1;

    // スコアに基づいて強度を返す
    if (score <= 2) {
        return {
            score,
            label: '弱い',
            color: 'bg-red-500',
            width: '25%',
            message: '大文字、小文字、数字を含めてください',
        };
    } else if (score <= 3) {
        return {
            score,
            label: '普通',
            color: 'bg-yellow-500',
            width: '50%',
            message: '特殊文字を追加するとより安全です',
        };
    } else if (score <= 4) {
        return {
            score,
            label: '良い',
            color: 'bg-blue-500',
            width: '75%',
            message: 'より長いパスワードにするとさらに安全です',
        };
    } else {
        return {
            score,
            label: '非常に強い',
            color: 'bg-green-500',
            width: '100%',
            message: '非常に安全なパスワードです',
        };
    }
}
