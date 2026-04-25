'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { HiPaperAirplane, HiSparkles } from 'react-icons/hi2';

const SUGGESTIONS = [
    'What should I wear for a date?',
    'Style tips for a job interview',
    'Match my black shirt',
    'What\'s trending this season?',
    'Build me a casual weekend outfit',
    'What\'s my style score?',
];

export default function ChatPage() {
    const { token, user } = useAuthStore();
    const { messages, addMessage, isTyping, setTyping } = useChatStore();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        setInput('');

        const userMsg = {
            id: crypto.randomUUID(),
            role: 'user' as const,
            content: text.trim(),
            timestamp: new Date().toISOString(),
        };
        addMessage(userMsg);
        setTyping(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: text.trim() }),
            });
            const data = await res.json();

            // Simulate typing delay
            await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

            if (data.message) {
                addMessage(data.message);
            }
        } catch (e) {
            console.error(e);
            addMessage({
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "I'm having trouble connecting. Please try again!",
                timestamp: new Date().toISOString(),
            });
        } finally {
            setTyping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-128px)] max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-4 border-b border-border"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-accent/8 flex items-center justify-center">
                        <HiSparkles className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-text-primary">AI Stylist</h1>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                            Online · Powered by StyleAI
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-accent/8 flex items-center justify-center mb-4">
                            <HiSparkles className="w-10 h-10 text-accent" />
                        </div>
                        <h2 className="text-lg font-bold text-text-primary mb-1">Your AI Style Assistant</h2>
                        <p className="text-sm text-text-muted mb-6 max-w-sm">
                            Ask me about outfit ideas, color matching, style tips, or wardrobe recommendations.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                            {SUGGESTIONS.map((s, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    onClick={() => sendMessage(s)}
                                    className="px-3 py-2 rounded-2xl text-xs text-text-secondary border border-border hover:border-accent/20 hover:bg-accent/5 transition-all"
                                >
                                    {s}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-accent-end flex items-center justify-center">
                                        <HiSparkles className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <span className="text-[10px] text-text-muted">StyleAI</span>
                                </div>
                            )}
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-accent to-accent-end text-white rounded-br-md'
                                    : 'glass text-text-secondary rounded-bl-md'
                                }`}>
                                {msg.content}
                            </div>
                            <p className={`text-[10px] text-text-muted mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-accent-end flex items-center justify-center flex-shrink-0 mt-1">
                            <HiSparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="glass px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 rounded-full bg-accent"
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your AI stylist..."
                        className="input-field flex-1"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-accent-end flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:shadow-lg hover:shadow-accent/15 transition-all"
                    >
                        <HiPaperAirplane className="w-4 h-4 text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
}
