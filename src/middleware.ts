import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Public paths
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Login page is public for admin
    if (request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Check auth
    if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await decrypt(session);
    if (!payload) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const role = payload.role;
    const path = request.nextUrl.pathname;

    // Role based access control
    if (role === 'start' && !path.startsWith('/admin/start')) {
        return NextResponse.redirect(new URL('/admin/start', request.url));
    }

    if (role === 'finish' && !path.startsWith('/admin/finish')) {
        return NextResponse.redirect(new URL('/admin/finish', request.url));
    }

    // 'admin' (ersel) has access to everything, but specifically /admin dashboard
    // If admin tries to go to login, redirect to dashboard? (Handled by frontend logic mostly, but good here too)

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
