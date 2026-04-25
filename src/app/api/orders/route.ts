import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { items, total, address } = await request.json();

    const delivery = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const order = createOrder({
        userId,
        items,
        total,
        status: 'confirmed',
        address,
        estimatedDelivery: delivery,
    });

    return NextResponse.json({ order });
}

export async function GET(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const order = getOrderById(id);
        return order
            ? NextResponse.json({ order })
            : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const orders = getOrders(userId);
    return NextResponse.json({ orders });
}

export async function PATCH(request: NextRequest) {
    const { id, status } = await request.json();
    const order = updateOrderStatus(id, status);
    return order
        ? NextResponse.json({ order })
        : NextResponse.json({ error: 'Not found' }, { status: 404 });
}
