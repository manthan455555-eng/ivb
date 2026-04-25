import { create } from 'zustand';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatState {
    messages: ChatMessage[];
    isTyping: boolean;
    addMessage: (msg: ChatMessage) => void;
    setTyping: (v: boolean) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isTyping: false,
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
    setTyping: (v) => set({ isTyping: v }),
    clearMessages: () => set({ messages: [] }),
}));
