
import { motion } from "framer-motion";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="min-h-screen font-body text-[#402F26] relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/ai-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-rose-50/10 backdrop-blur-[3px]" />
            </div>

            {/* Logo - Top Left */}
            <div className="absolute top-6 left-6 z-50">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
                </div>
            </div>

            {/* Back Button - Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <Link
                    to="/"
                    className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-[#402F26] shadow-sm hover:bg-rose-50 hover:text-[#DE7983] hover:ring-1 hover:ring-rose-200 hover:shadow-md transition-all border border-white/50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>

            <main className="relative z-10 w-full max-w-5xl h-[85vh] px-4 flex flex-col">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 w-full"
                >
                    <ChatWidget mode="full" />
                </motion.div>
            </main>
        </div>
    );
}
