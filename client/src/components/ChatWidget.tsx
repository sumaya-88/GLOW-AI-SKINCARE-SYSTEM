import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, VolumeX, Bot, User, Loader2, X, MessageSquare, RotateCcw } from 'lucide-react';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useLocation } from 'react-router-dom';

// Simple Button Component
function Button({ children, onClick, variant = 'primary', size = 'default', disabled, className = '', type = 'button' }: any) {
    const baseClass = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants: any = {
        primary: "bg-[#DE7983] text-white hover:bg-[#c96a73] shadow",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    const sizes: any = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`}
        >
            {children}
        </button>
    );
}

// Simple Input Component
const Input = ({ value, onChange, placeholder, disabled, className = '' }: any) => (
    <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
);

export default function ChatWidget({ mode = 'floating' }: { mode?: 'floating' | 'full' }) {
    const [isOpen, setIsOpen] = useState(mode === 'full');
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Get skin details from local storage for context
    const getSkinContext = () => {
        try {
            const details = localStorage.getItem("glowai_skin_details");
            return details ? JSON.parse(details) : undefined;
        } catch (e) {
            return undefined;
        }
    };

    const sectionContext = getSkinContext();

    const {
        messages,
        isLoading,
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        sendMessage,
        stopSpeaking,
        replayLastMessage,
    } = useVoiceChat({
        questionnaireData: sectionContext,
        onRoutineUpdateSuggested: () => {
            console.log("Routine update suggested by AI");
        }
    });

    // Stop speaking on navigation
    useEffect(() => {
        stopSpeaking();
    }, [location.pathname, stopSpeaking]);

    // Stop speaking when closed
    useEffect(() => {
        if (!isOpen) {
            stopSpeaking();
        }
    }, [isOpen, stopSpeaking]);

    useEffect(() => {
        if (mode === 'full') {
            setIsOpen(true);
            return;
        }

        const handleProductAction = (e: any) => {
            const product = e.detail;
            setIsOpen(true);
            sendMessage(`I want to add ${product.name} (${product.type}) to my routine. Should I replace an existing product or just add it?`);
        };

        window.addEventListener('trigger-product-action', handleProductAction);
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);

        return () => {
            window.removeEventListener('trigger-product-action', handleProductAction);
            window.removeEventListener('open-chat', handleOpenChat);
        };
    }, [sendMessage, mode]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // Styles based on mode
    const containerClass = mode === 'full'
        ? "flex flex-col h-full w-full bg-white/40 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 overflow-hidden"
        : "fixed bottom-24 right-6 z-[101] flex h-[500px] w-[90vw] max-w-[360px] flex-col overflow-hidden rounded-[32px] bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/50 border border-white/50";

    return (
        <>
            {/* Floating Toggle Button (Only in floating mode) */}
            <AnimatePresence>
                {mode === 'floating' && !isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-[101] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] text-white shadow-lg shadow-rose-200 transition-transform hover:scale-110 active:scale-95"
                    >
                        <MessageSquare className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {(isOpen || mode === 'full') && (
                    <motion.div
                        initial={mode === 'floating' ? { opacity: 0, y: 100, scale: 0.9 } : { opacity: 1, y: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={mode === 'floating' ? { opacity: 0, y: 100, scale: 0.9 } : undefined}
                        className={containerClass}
                    >
                        {/* Floating Mode Background */}
                        {mode === 'floating' && (
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    backgroundImage: `url('/assets/chat-bg.png')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[2px]" />
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/30 bg-white/10 backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#DE7983]/10 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-[#DE7983]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#402F26]">Skincare AI Assistant</h3>
                                        <p className="text-xs text-[#8C8181]">Voice-enabled • Tap mic to speak</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* Replay Button */}
                                    {!isSpeaking && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                                        <Button variant="ghost" size="icon" onClick={replayLastMessage} title="Speak Again">
                                            <RotateCcw className="w-4 h-4 text-[#8C8181]" />
                                        </Button>
                                    )}

                                    {isSpeaking && (
                                        <Button variant="ghost" size="icon" onClick={stopSpeaking}>
                                            <VolumeX className="w-4 h-4 text-[#8C8181]" />
                                        </Button>
                                    )}

                                    {mode === 'floating' && (
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                            <X className="w-4 h-4 text-[#8C8181]" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto bg-transparent scrollabar-thin" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#DE7983]/10 flex items-center justify-center">
                                                <Bot className="w-8 h-8 text-[#DE7983]" />
                                            </div>
                                            <h4 className="font-medium text-[#402F26] mb-2">Hi! I'm your skincare assistant</h4>
                                            <p className="text-sm font-bold text-[#402F26]/90 max-w-sm mx-auto">
                                                Ask me anything about skincare routines, products, or ingredients.
                                                You can type or use voice!
                                            </p>
                                        </motion.div>
                                    )}

                                    <AnimatePresence>
                                        {messages.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.role === 'assistant' && (
                                                    <div className="w-8 h-8 rounded-full bg-[#DE7983]/10 flex items-center justify-center flex-shrink-0">
                                                        <Bot className="w-4 h-4 text-[#DE7983]" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.role === 'user'
                                                        ? 'bg-[#DE7983] text-white rounded-br-md'
                                                        : 'bg-white text-[#402F26] border border-gray-100 rounded-bl-md shadow-sm'
                                                        }`}
                                                >
                                                    {message.content}
                                                </div>
                                                {message.role === 'user' && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#DE7983]/10 flex items-center justify-center">
                                                <Bot className="w-4 h-4 text-[#DE7983]" />
                                            </div>
                                            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                                                <Loader2 className="w-4 h-4 animate-spin text-[#8C8181]" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Voice indicator */}
                            <AnimatePresence>
                                {isListening && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-4 py-2 bg-[#DE7983]/5 border-t"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {[...Array(4)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-1 bg-[#DE7983] rounded-full"
                                                        animate={{
                                                            height: [8, 16, 8],
                                                        }}
                                                        transition={{
                                                            duration: 0.5,
                                                            repeat: Infinity,
                                                            delay: i * 0.1,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-[#8C8181]">
                                                {transcript || 'Listening...'}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Speaking indicator */}
                            <AnimatePresence>
                                {isSpeaking && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
                                    >
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full shadow-md border border-emerald-200">
                                            <Volume2 className="w-4 h-4 animate-pulse" />
                                            <span className="text-xs font-semibold">Speaking...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Input */}
                            <div className="flex-shrink-0 bg-white/20 backdrop-blur-md border-t border-white/30 p-4 z-20">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex gap-2 items-end">
                                        <Button
                                            type="button"
                                            variant={isListening ? 'destructive' : 'ghost'}
                                            size="icon"
                                            onClick={handleVoiceToggle}
                                            disabled={isLoading}
                                            className={`flex-shrink-0 rounded-full h-12 w-12 transition-all ${isListening ? 'animate-pulse ring-4 ring-red-100' : 'bg-gray-100/50 hover:bg-gray-100'}`}
                                        >
                                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#8C8181]" />}
                                        </Button>
                                        <div className="flex-1 min-h-[48px] bg-gray-50 rounded-[24px] px-4 py-1 flex items-center border border-transparent focus-within:border-[#DE7983]/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#DE7983]/10 transition-all">
                                            <Input
                                                value={inputValue}
                                                onChange={(e: any) => setInputValue(e.target.value)}
                                                placeholder="Type or tap mic to speak..."
                                                disabled={isLoading || isListening}
                                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-base placeholder:text-gray-400 h-10"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={!inputValue.trim() || isLoading}
                                            className="flex-shrink-0 rounded-full h-12 w-12 bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                                        >
                                            <Send className="w-5 h-5 ml-0.5" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
