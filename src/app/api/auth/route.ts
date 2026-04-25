import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db';
import { encodeToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === 'signup') {
        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const existing = findUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }
        const user = createUser({ email, password, name, onboarded: false });
        const token = encodeToken({ userId: user.id, email: user.email });
        return NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, onboarded: user.onboarded },
            token,
        });
    }

    if (action === 'login') {
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const user = findUserByEmail(email);
        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        const token = encodeToken({ userId: user.id, email: user.email });
        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                onboarded: user.onboarded,
                styleProfile: user.styleProfile,
                preferences: user.preferences,
                avatar: user.avatar,
            },
            token,
        });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
