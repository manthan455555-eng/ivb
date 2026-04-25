import { NextRequest, NextResponse } from 'next/server';
import { addWardrobeItem, getWardrobeItems, deleteWardrobeItem } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';
import { autoTagClothing } from '@/lib/ai';

export async function GET(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const items = getWardrobeItems(userId);
    return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    const { name, image } = body;
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const tags = autoTagClothing(name);
    const item = addWardrobeItem({
        userId,
        name,
        image: image || `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop`,
        ...tags,
    });

    return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    deleteWardrobeItem(id);
    return NextResponse.json({ success: true });
}
