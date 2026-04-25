// Mock database - in-memory store for all app data
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar?: string;
    styleProfile?: StyleProfile;
    preferences?: string[];
    onboarded: boolean;
    createdAt: string;
}

export interface StyleProfile {
    faceShape: string;
    skinTone: string;
    bodyType: string;
    styleScore: number;
    recommendedColors: string[];
    styleSummary: string;
    dominantStyle: string;
}

export interface WardrobeItem {
    id: string;
    userId: string;
    name: string;
    image: string;
    category: string;
    color: string;
    occasion: string[];
    tags: string[];
    addedAt: string;
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    color: string;
    sizes: string[];
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    aiRecommended?: boolean;
}

export interface CartItem {
    productId: string;
    quantity: number;
    size: string;
}

export interface Order {
    id: string;
    userId: string;
    items: (CartItem & { product: Product })[];
    total: number;
    status: 'confirmed' | 'packed' | 'out_for_delivery' | 'arriving' | 'delivered';
    address: string;
    createdAt: string;
    estimatedDelivery: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// In-memory data store
const db: {
    users: User[];
    wardrobe: WardrobeItem[];
    orders: Order[];
    chatHistory: Record<string, ChatMessage[]>;
} = {
    users: [],
    wardrobe: [],
    orders: [],
    chatHistory: {},
};

// User CRUD
export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    return newUser;
}

export function findUserByEmail(email: string): User | undefined {
    return db.users.find(u => u.email === email);
}

export function findUserById(id: string): User | undefined {
    return db.users.find(u => u.id === id);
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    db.users[idx] = { ...db.users[idx], ...updates };
    return db.users[idx];
}

// Wardrobe CRUD
export function addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'addedAt'>): WardrobeItem {
    const newItem: WardrobeItem = {
        ...item,
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString(),
    };
    db.wardrobe.push(newItem);
    return newItem;
}

export function getWardrobeItems(userId: string): WardrobeItem[] {
    return db.wardrobe.filter(i => i.userId === userId);
}

export function deleteWardrobeItem(id: string): boolean {
    const idx = db.wardrobe.findIndex(i => i.id === id);
    if (idx === -1) return false;
    db.wardrobe.splice(idx, 1);
    return true;
}

// Orders
export function createOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
        ...order,
        id: 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    return newOrder;
}

export function getOrders(userId: string): Order[] {
    return db.orders.filter(o => o.userId === userId);
}

export function getOrderById(id: string): Order | undefined {
    return db.orders.find(o => o.id === id);
}

export function updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx === -1) return undefined;
    db.orders[idx].status = status;
    return db.orders[idx];
}

// Chat
export function getChatHistory(userId: string): ChatMessage[] {
    return db.chatHistory[userId] || [];
}

export function addChatMessage(userId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    if (!db.chatHistory[userId]) db.chatHistory[userId] = [];
    const msg: ChatMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
    };
    db.chatHistory[userId].push(msg);
    return msg;
}
