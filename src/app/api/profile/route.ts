import { NextRequest, NextResponse } from 'next/server';
import { findUserById, updateUser } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';
import { generateStyleProfile } from '@/lib/ai';

export async function POST(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { preferences, avatar } = body;

    const profile = generateStyleProfile(preferences || []);
    const updated = updateUser(userId, {
        styleProfile: profile,
        preferences,
        avatar,
        onboarded: true,
    });

    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({
        user: {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            onboarded: updated.onboarded,
            styleProfile: updated.styleProfile,
            preferences: updated.preferences,
            avatar: updated.avatar,
        },
    });
}

export async function GET(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = findUserById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

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
    });
}
