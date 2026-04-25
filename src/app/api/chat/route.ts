import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { addChatMessage, getChatHistory, findUserById } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { message } = await request.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const user = findUserById(userId);

    // Save user message
    addChatMessage(userId, { role: 'user', content: message });

    // Generate AI response
    const response = generateChatResponse(message, user?.styleProfile, 0);
    const aiMsg = addChatMessage(userId, { role: 'assistant', content: response });

    return NextResponse.json({ message: aiMsg });
}

export async function GET(request: NextRequest) {
    const auth = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = getUserIdFromToken(auth);
    if (!userId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const messages = getChatHistory(userId);
    return NextResponse.json({ messages });
}
