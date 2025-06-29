// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const Adminpathname = req.nextUrl.pathname;

    if (Adminpathname.startsWith('/admin') && !user) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return res;
}
