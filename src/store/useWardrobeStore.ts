import { create } from 'zustand';

interface WardrobeItem {
    id: string;
    name: string;
    image: string;
    category: string;
    color: string;
    occasion: string[];
    tags: string[];
}

interface WardrobeState {
    items: WardrobeItem[];
    setItems: (items: WardrobeItem[]) => void;
    addItem: (item: WardrobeItem) => void;
    removeItem: (id: string) => void;
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
    addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
}));
