import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie } from 'hono/cookie';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from 'hono/utils/cookie';

export const adminAuthMiddleware = createMiddleware(async (c, next) => {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    // Honoのリクエストからすべてのクッキーを取得
                    const cookieHeader = c.req.header('cookie');
                    if (!cookieHeader) return [];

                    return cookieHeader.split(';').map((cookie) => {
                        const [name, value] = cookie.trim().split('=');
                        return { name, value };
                    });
                },
                setAll(cookiesToSet) {
                    // Honoのレスポンスにクッキーを設定
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // Supabaseのクッキーオプションをhonoの型に変換
                        const honoOptions: CookieOptions = {};

                        if (options) {
                            if (options.domain) honoOptions.domain = options.domain;
                            if (options.expires) honoOptions.expires = options.expires;
                            if (options.httpOnly !== undefined)
                                honoOptions.httpOnly = options.httpOnly;
                            if (options.maxAge !== undefined) honoOptions.maxAge = options.maxAge;
                            if (options.path) honoOptions.path = options.path;
                            if (options.secure !== undefined) honoOptions.secure = options.secure;
                            if (options.sameSite)
                                honoOptions.sameSite = options.sameSite as
                                    | 'Strict'
                                    | 'Lax'
                                    | 'None';
                        }

                        setCookie(c, name, value, honoOptions);
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = new URL(c.req.url).pathname;

    if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
        // ユーザーが認証されていない場合、ログインページにリダイレクト
        return c.redirect('/login');
    }

    await next();
});
