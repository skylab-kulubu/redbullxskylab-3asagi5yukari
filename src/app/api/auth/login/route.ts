import { login } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const formData = new FormData();
    formData.append('id', body.id);
    formData.append('password', body.password);

    const result = await login(formData);

    if (result.success) {
        return NextResponse.json({ success: true, role: result.role });
    } else {
        return NextResponse.json({ success: false }, { status: 401 });
    }
}
