// Auth utility — mock JWT-like token system
const SECRET = 'styleai-secret-key-2024';

export function encodeToken(payload: Record<string, unknown>): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
    const signature = btoa(SECRET + body);
    return `${header}.${body}.${signature}`;
}

export function decodeToken(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

export function getUserIdFromToken(token: string): string | null {
    const payload = decodeToken(token);
    if (!payload) return null;
    return payload.userId as string;
}
