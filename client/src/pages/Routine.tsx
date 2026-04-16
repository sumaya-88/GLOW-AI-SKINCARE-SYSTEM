import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
    Sun,
    Moon,
    Clock,
    CheckCircle2,
    Bell,
    Sparkles,
    ChevronRight,
    Calendar,
    User,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface RoutineStep {
    id: string;
    name: string;
    product: string;
    brand: string;
    duration: string;
    completed: boolean;
    category: string;
}

export default function Routine() {
    const navigate = useNavigate();
    const [routine, setRoutine] = useState<any>(null);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [showReminders, setShowReminders] = useState(false);
    const [activeTab, setActiveTab] = useState<"day" | "night">("day");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const hasInteracted = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Initial load from local storage
            if (parsedUser.remindersEnabled) setShowReminders(true);
        }

        // Always fetch fresh profile to sync state
        api.getProfile().then(profile => {
            if (profile) {
                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile));
                // Only sync if user hasn't toggled manually yet
                if (!hasInteracted.current) {
                    setShowReminders(!!profile.remindersEnabled);
                }
            }
        }).catch(err => console.error("Failed to sync profile:", err));

        const loadRoutine = () => {

            try {
                const savedRoutine = localStorage.getItem("glowai_routine");
                const savedProgress = localStorage.getItem("glowai_progress");

                if (savedRoutine) {
                    const parsed = JSON.parse(savedRoutine);
                    if (parsed && (parsed.dayRoutine || parsed.nightRoutine)) {
                        setRoutine(parsed);
                    }
                }

                if (savedProgress) {
                    setCompletedSteps(JSON.parse(savedProgress));
                }
            } catch (e) {
                console.error("Failed to load routine data", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadRoutine();

        // Listen for updates from Chatbot
        const handleRoutineUpdate = (event: CustomEvent) => {
            console.log("Routine update detected in UI!", event.detail);
            setRoutine(event.detail);
        };

        window.addEventListener('routine-updated', handleRoutineUpdate as EventListener);

        return () => {
            window.removeEventListener('routine-updated', handleRoutineUpdate as EventListener);
        };
    }, []);

    const toggleStep = (id: string) => {
        const fullId = `${activeTab}-${id}`;
        const newProgress = completedSteps.includes(fullId)
            ? completedSteps.filter(s => s !== fullId)
            : [...completedSteps, fullId];

        setCompletedSteps(newProgress);
        localStorage.setItem("glowai_progress", JSON.stringify(newProgress));
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAEEEA] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#DE7983] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!routine) {
        return (
            <div className="min-h-screen bg-[#FAEEEA] font-body text-[#402F26]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                                <Sparkles className="h-5 w-5" />
                            </Link>
                            <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8C8181]">
                            <Link to="/" className="hover:text-[#402F26]">Home</Link>
                            <Link to="/analyze" className="hover:text-[#402F26]">Analyze</Link>
                            <Link to="/routine" className="text-[#DE7983] font-bold">Routine</Link>
                            <Link to="/products" className="hover:text-[#402F26]">Products</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-[#DE7983] transition-all hover:bg-rose-100"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="hidden sm:block rounded-full bg-[#402F26] px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-95"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/analyze" className="rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95">
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-32 text-center">
                    <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-[#DE7983]">
                        <Calendar className="h-10 w-10" />
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-[#402F26] mb-4">No Routine Available</h1>
                    <p className="text-[#8C8181] mb-12 max-w-md mx-auto">
                        Your personalized skincare routine will be available after our AI analysis recommendation.
                    </p>
                    <Link
                        to="/analyze"
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-10 py-5 text-lg font-bold text-white shadow-xl shadow-rose-200 transition-all hover:scale-105 active:scale-95"
                    >
                        Start New Analysis
                        <Sparkles className="h-5 w-5" />
                    </Link>
                </main>
            </div>
        );
    }

    const currentStepsData = (activeTab === "day" ? routine.dayRoutine : routine.nightRoutine) || [];

    // Safety check map
    const currentSteps: RoutineStep[] = currentStepsData.map((p: any) => ({
        id: p?.id || Math.random().toString(),
        name: p?.type || "Product", // Fallback for name
        product: p?.name || "Unknown Product",
        brand: p?.brand || "Generic",
        duration: "60 sec",
        completed: completedSteps.includes(`${activeTab}-${p?.id}`),
        category: p?.type || "General"
    }));

    const completedCount = currentSteps.filter(s => s.completed).length;
    const progressPercentage = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

    return (
        <div className="min-h-screen font-body text-[#402F26] relative bg-rose-50">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/routine-bg-latest.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[6px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </Link>
                        <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8C8181]">
                        <Link to="/" className="hover:text-[#402F26]">Home</Link>
                        <Link to="/analyze" className="hover:text-[#402F26]">Analyze</Link>
                        <Link to="/routine" className="text-[#DE7983] font-bold">Routine</Link>
                        <Link to="/products" className="hover:text-[#402F26]">Products</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-[#DE7983] transition-all hover:bg-rose-100"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:block rounded-full bg-[#402F26] px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-95"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/"
                                className="flex items-center gap-2 rounded-full bg-white/50 px-5 py-2.5 text-sm font-bold text-[#402F26] shadow-sm ring-1 ring-rose-100/50 transition-all hover:bg-rose-50 hover:text-[#DE7983] hover:ring-rose-200 hover:shadow-md active:scale-95"
                            >
                                <ArrowRight className="h-4 w-4 rotate-180" />
                                Back to Home
                            </Link>
                        )}
                    </div>
                </div>
            </header>


            <main className="relative z-10 w-full max-w-3xl mx-auto pt-12 pb-12 px-6">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/80 backdrop-blur-sm text-emerald-800 text-sm font-bold uppercase tracking-wider mb-6 border border-emerald-100">
                        <Clock className="w-4 h-4" />
                        Daily Routine
                    </div>
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#402F26] mb-4">
                        Your Skincare Routine
                    </h1>
                    <p className="text-[#402F26]/70 text-lg font-medium">
                        Consistency is the key to glowing skin.
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-4 mb-8"
                >
                    <button
                        onClick={() => setActiveTab("day")}
                        className={`flex-1 p-4 rounded-3xl border-2 transition-all duration-300 flex items-center justify-center gap-4 ${activeTab === "day"
                            ? "border-[#DE7983] bg-rose-50/50 shadow-lg shadow-rose-100"
                            : "border-white/50 bg-white/50 hover:border-rose-100 text-[#8C8181]"
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab === "day" ? "bg-[#DE7983] text-white" : "bg-[#FAEEEA] text-[#DE7983]"
                            }`}>
                            <Sun className="w-6 h-6" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className={`font-bold text-lg ${activeTab === "day" ? "text-[#402F26]" : ""}`}>Morning</p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">{(routine.dayRoutine || []).length} steps</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab("night")}
                        className={`flex-1 p-4 rounded-3xl border-2 transition-all duration-300 flex items-center justify-center gap-4 ${activeTab === "night"
                            ? "border-indigo-400 bg-indigo-50/50 shadow-lg shadow-indigo-100"
                            : "border-white/50 bg-white/50 hover:border-indigo-100 text-[#8C8181]"
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab === "night" ? "bg-indigo-500 text-white" : "bg-[#FAEEEA] text-indigo-400"
                            }`}>
                            <Moon className="w-6 h-6" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className={`font-bold text-lg ${activeTab === "night" ? "text-[#402F26]" : ""}`}>Evening</p>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">{(routine.nightRoutine || []).length} steps</p>
                        </div>
                    </button>
                </motion.div>

                {/* Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase text-[#402F26]/60 tracking-widest">
                            {completedCount} of {currentSteps.length} steps completed
                        </span>
                        <span className="text-lg font-black text-[#DE7983]">
                            {Math.round(progressPercentage)}%
                        </span>
                    </div>
                    <div className="h-4 bg-white/50 border border-white/50 rounded-full overflow-hidden shadow-inner p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] rounded-full shadow-sm"
                        />
                    </div>
                </motion.div>

                {/* Routine Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4 mb-12"
                >
                    {currentSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div
                                onClick={() => toggleStep(step.id)}
                                className={`group relative flex items-center gap-5 rounded-3xl p-6 border-2 cursor-pointer transition-all duration-300 ${step.completed
                                    ? "border-emerald-100/50 opacity-60 bg-emerald-50/40 grayscale-[0.5]"
                                    : "bg-white/70 border-white/50 shadow-sm hover:shadow-lg hover:border-white hover:-translate-y-1"
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${step.completed ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-300 group-hover:bg-[#DE7983] group-hover:text-white"
                                    }`}>
                                    {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-4 h-4 rounded-full bg-current" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8C8181] bg-gray-50/50 px-2 py-1 rounded-md">
                                            Step {index + 1}
                                        </span>
                                        <span className="font-bold text-[#402F26] text-lg">{step.name}</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#8C8181] truncate pl-1">
                                        {step.product} <span className="opacity-40 mx-1">•</span> {step.brand}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 text-right hidden sm:block">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C8181] opacity-60 bg-gray-50/50 px-3 py-1.5 rounded-full">
                                        <Clock className="w-3.5 h-3.5" />
                                        {step.duration}
                                    </div>
                                </div>

                                <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${step.completed ? "opacity-0" : "group-hover:translate-x-1"}`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Extra Stats Grid (Replaces Sidebar) */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Streak */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-[32px] bg-gradient-to-br from-[#DE7983] to-[#F0AF8B] p-6 text-white shadow-xl shadow-rose-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl font-bold">Your Streak</h3>
                            <Sparkles className="w-5 h-5 text-white/80" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black">{user?.streak || 0}</span>
                            <span className="text-lg font-bold mb-1 opacity-90">Days</span>
                        </div>
                        {(!user?.streak || user.streak === 0) && (
                            <button
                                onClick={async () => {
                                    try {
                                        await api.startStreak(); // We will add this to api.ts
                                        // Update local user state
                                        const updatedUser = { ...user, streak: 1 };
                                        setUser(updatedUser);
                                        localStorage.setItem("user", JSON.stringify(updatedUser));
                                    } catch (e) {
                                        console.error("Failed to start streak", e);
                                    }
                                }}
                                className="mt-4 w-full rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2 transition-all"
                            >
                                Start Routine!
                            </button>
                        )}
                    </motion.div>

                    {/* Tip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-[32px] bg-[#F0FDF4]/80 backdrop-blur-sm border border-emerald-100 p-6"
                    >
                        <h3 className="font-serif text-lg font-bold text-[#166534] mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Tip of the Day
                        </h3>
                        <p className="text-[#15803d] text-sm font-medium leading-relaxed">
                            "Apply products from thinnest to thickest: toner, serum, then moisturizer."
                        </p>
                    </motion.div>
                </div>

                {/* Reminders Toggle */}
                <div className="mt-8 flex items-center justify-between bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#DE7983] text-white flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-[#402F26] text-sm">Daily Reminders (7AM & 10PM)</span>
                    </div>
                    <button
                        onClick={async () => {
                            hasInteracted.current = true; // Mark as user-interacted
                            const newValue = !showReminders;
                            setShowReminders(newValue);
                            // Persist to backend and local storage
                            try {
                                await api.updateProfile({ remindersEnabled: newValue });
                                const updatedUser = { ...user, remindersEnabled: newValue };
                                setUser(updatedUser);
                                localStorage.setItem("user", JSON.stringify(updatedUser));
                            } catch (e) {
                                console.error("Failed to update reminders", e);
                                // Revert UI if failed
                                setShowReminders(!newValue);
                            }
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showReminders ? "bg-[#DE7983]" : "bg-gray-300"}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showReminders ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>
            </main>
        </div>
    );
}
