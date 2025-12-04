import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.AUTH_SECRET || 'redbull-secret-key-change-me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

export async function login(formData: FormData) {
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;

    // Hardcoded users with env passwords
    const users: Record<string, any> = {
        start: { role: 'start', password: process.env.ADMIN_START_PASSWORD || 'start123' },
        finish: { role: 'finish', password: process.env.ADMIN_FINISH_PASSWORD || 'finish123' },
        ersel: { role: 'admin', password: process.env.ADMIN_ERSEL_PASSWORD || 'ersel123' },
    };

    const user = users[id];

    if (user && user.password === password) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = await encrypt({ user: id, role: user.role, expires });

        const cookieStore = await cookies();
        cookieStore.set('session', session, { expires, httpOnly: true });
        return { success: true, role: user.role };
    }

    return { success: false };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', { expires: new Date(0) });
}
