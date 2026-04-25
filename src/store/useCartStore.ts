import { create } from 'zustand';
import type { Product } from '@/lib/db';

interface CartItem {
    product: Product;
    quantity: number;
    size: string;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, size: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (product, size) =>
        set((state) => {
            const existing = state.items.find(i => i.product.id === product.id && i.size === size);
            if (existing) {
                return {
                    items: state.items.map(i =>
                        i.product.id === product.id && i.size === size
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }
            return { items: [...state.items, { product, quantity: 1, size }] };
        }),
    removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.product.id !== productId) })),
    updateQuantity: (productId, quantity) =>
        set((state) => ({
            items: quantity <= 0
                ? state.items.filter(i => i.product.id !== productId)
                : state.items.map(i => (i.product.id === productId ? { ...i, quantity } : i)),
        })),
    clearCart: () => set({ items: [] }),
    getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
