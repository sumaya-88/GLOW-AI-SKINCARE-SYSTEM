import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Calendar, Bot, ShieldCheck, Droplets, Utensils, Moon, Sun, X, Check, Leaf, HelpCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendations, getLifestyleTips, PRODUCTS_MAP, getSimilarProducts, type Product } from "@/lib/skinData";
import { api } from "@/lib/api";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const { skinDetails: stateDetails, photos: statePhotos } = location.state || {};

    // Safe JSON parse helper
    const safeParse = (key: string) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`Error parsing ${key}:`, e);
            return null;
        }
    };

    // Use state if available, otherwise fallback to localStorage
    const [skinDetails] = useState<any>(stateDetails || safeParse("glowai_skin_details"));
    const [photos] = useState<any>(statePhotos || safeParse("glowai_photos"));

    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [productToConfirm, setProductToConfirm] = useState<Product | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        if (!skinDetails || !skinDetails.skinType) {
            console.error("Missing skin details in Results page. Redirecting...");
            navigate("/analyze");
            return;
        }

        const fetchAnalysis = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/chat/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ skinProfile: skinDetails })
                });

                if (!response.ok) throw new Error("Server error");
                const data = await response.json();

                // Merge with full product details from client side (to get real images)
                // Merge with full product details or use dynamic data
                // Map AI-generated "imageUrl" slugs to static assets
                const placeholderMap: Record<string, string> = {
                    "placeholder_cleanser": "/assets/products/cleanser-default.png", // Ensure these exist or use URL from skinData
                    "placeholder_toner": "/assets/products/toner-default.png",
                    "placeholder_serum": "/assets/products/serum-default.png",
                    "placeholder_moisturizer": "/assets/products/moisturizer-default.png",
                    "placeholder_sunscreen": "/assets/products/sunscreen-default.png",
                };

                // Fallback URLs if assets aren't local (using reliable CDNs for demo)
                const fallbackMap: Record<string, string> = {
                    "Cleanser": "https://m.media-amazon.com/images/I/51pM7uO0X2L._SL1500_.jpg",
                    "Toner": "https://m.media-amazon.com/images/I/61iP6C83UPL._SL1500_.jpg",
                    "Serum": "https://m.media-amazon.com/images/I/61NlId0F2BL._SL1500_.jpg",
                    "Moisturizer": "https://m.media-amazon.com/images/I/71O69e7uUeL._SL1500_.jpg",
                    "Sunscreen": "https://m.media-amazon.com/images/I/71I9wX4-T6L._SL1500_.jpg"
                };

                const hydrate = (list: any[]) => list.map(item => {
                    // Try to find in local static map first (for backward compatibility or if AI picks exact ID)
                    const full = (PRODUCTS_MAP as any)[item.id];

                    if (full) {
                        return { ...full, ...item, category: item.type };
                    }

                    // Dynamic Product handling
                    let img = placeholderMap[item.imageUrl] || fallbackMap[item.type] || fallbackMap["Cleanser"];

                    return {
                        ...item,
                        category: item.type,
                        imageUrl: img, // Use the resolved image
                        suitableFor: ["all"], // specific data might be missing in dynamic gen, safe default
                        concerns: skinDetails.concerns || []
                    };
                });

                setResults({
                    dayRoutine: hydrate(data.dayRoutine || []),
                    nightRoutine: hydrate(data.nightRoutine || []),
                    aiAnalysis: data.analysis || data.aiAnalysis
                });
            } catch (error) {
                console.error("Deep AI Analysis failed:", error);
                // Fallback to simple logic if server fails
                const localRecs = getRecommendations(skinDetails.skinType, skinDetails.concerns, skinDetails.budget);
                setResults(localRecs);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [skinDetails, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const handleBuildRoutine = async () => {
        if (results) {
            localStorage.setItem("glowai_routine", JSON.stringify(results));
            localStorage.setItem("skinType", skinDetails?.skinType || "Normal");
            // Clear progress to start fresh
            localStorage.setItem("glowai_progress", JSON.stringify([]));

            // Sync to Backend Profile
            try {
                const allProducts = [...(results.dayRoutine || []), ...(results.nightRoutine || [])];
                // Unique product names
                const productNames = Array.from(new Set(allProducts.map((p: any) => p.name)));

                if (productNames.length > 0) {
                    await api.updateProfile({
                        currentlyUsing: productNames.join(", "),
                        skinType: skinDetails?.skinType || "Normal"
                    });
                }
            } catch (e) {
                console.error("Failed to sync routine to profile", e);
            }

            navigate("/routine");
        }
    };

    const isProductInRoutine = (productId: string) => {
        if (!results) return false;
        const allRoutineIds = [...(results.dayRoutine || []), ...(results.nightRoutine || [])].map(p => p.id);
        return allRoutineIds.includes(productId);
    };

    const handleUpdateRoutine = (newProduct: Product) => {
        if (!results) return;

        const updateList = (list: Product[]) => {
            const index = list.findIndex(p => p.type === newProduct.type);
            if (index !== -1) {
                const newList = [...list];
                newList[index] = newProduct;
                return newList;
            }
            return [...list, newProduct];
        };

        const newResults = {
            ...results,
            dayRoutine: (newProduct.timeOfDay === "Day" || newProduct.timeOfDay === "Both")
                ? updateList(results.dayRoutine || [])
                : results.dayRoutine,
            nightRoutine: (newProduct.timeOfDay === "Night" || newProduct.timeOfDay === "Both")
                ? updateList(results.nightRoutine || [])
                : results.nightRoutine
        };

        setResults(newResults);
        setSelectedProduct(null);
        setShowConfirm(false);
        setProductToConfirm(null);
    };

    const promptAddToRoutine = (product: Product) => {
        if (isProductInRoutine(product.id)) return;
        setProductToConfirm(product);
        setShowConfirm(true);
    };

    // Helper to get category color
    const getCategoryStyles = (category: string) => {
        switch ((category || "").toLowerCase()) {
            case 'cleanser': return 'bg-rose-50 text-[#DE7983] border-rose-100';
            case 'toner': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'serum': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'moisturizer': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'sunscreen': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    // Safely combine products with defaults
    const allProducts = [...(results?.dayRoutine || []), ...(results?.nightRoutine || [])];
    const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

    const totalCost = uniqueProducts.reduce((sum, p) => sum + p.price, 0);

    if (isLoading) {
        return (
            <div className="min-h-screen font-body text-[#402F26] relative overflow-hidden flex flex-col items-center justify-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('/assets/analyze-bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[4px]" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-rose-100 border-t-[#DE7983] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-[#DE7983] animate-pulse" />
                        </div>
                    </div>
                    <h2 className="mt-8 text-2xl font-serif font-bold text-[#402F26]">Curating Your Routine...</h2>
                </div>
            </div>
        );
    }

    if (!results || (results.dayRoutine.length === 0 && results.nightRoutine.length === 0)) {
        return (
            <div className="min-h-screen font-body text-[#402F26] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url('/assets/analyze-bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[4px]" />
                </div>
                <div className="relative z-10">
                    <Bot className="h-16 w-16 text-[#DE7983] mb-6 opacity-50" />
                    <h2 className="text-2xl font-serif font-bold text-[#402F26] mb-4">Analysis Incomplete</h2>
                    <p className="text-[#8C8181] mb-8 max-w-md">We couldn't generate recommendations based on the provided details. Please try the analysis again.</p>
                    <Link to="/analyze" className="rounded-full bg-[#DE7983] px-8 py-3 text-white font-bold shadow-lg">
                        Restart Analysis
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-body text-[#402F26] relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/analyze-bg.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-rose-50/40 backdrop-blur-[4px]" />
            </div>

            <div className="relative z-10">
                {/* Top Navbar */}
                <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md shadow-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                                <Sparkles className="h-5 w-5" />
                            </Link>
                            <div className="font-serif text-2xl font-bold tracking-tight text-[#402F26]">GlowAI</div>
                        </div>

                        <nav className="hidden items-center gap-8 text-sm font-medium text-[#8C8181] md:flex">
                            <Link to="/" className="hover:text-[#DE7983]">Home</Link>
                            <Link to="/analyze" className="font-bold text-[#DE7983]">Analyze</Link>
                            <Link to="/routine" className="hover:text-[#DE7983]">Routine</Link>
                            <Link to="/products" className="hover:text-[#DE7983]">Products</Link>
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
                                    to="/analyze"
                                    className="rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-6 py-2 text-sm font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-6 pt-12 pb-24">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-[40px] bg-white shadow-xl shadow-rose-100/50 flex flex-col md:flex-row mb-12"
                    >
                        <div className="md:w-1/2 relative min-h-[400px]">
                            <img
                                src={photos?.front || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"}
                                className="absolute inset-0 h-full w-full object-cover"
                                alt="Analysis"
                            />
                            <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/90 backdrop-blur-sm px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Analysis Complete
                            </div>
                        </div>

                        <div className="md:w-1/2 p-10 md:p-12">
                            <h2 className="font-serif text-3xl font-bold text-[#402F26] mb-8">Your Skin Profile</h2>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#8C8181] mb-2">
                                        <span>Skin Type</span>
                                    </div>
                                    <div className="text-lg font-bold text-[#402F26] capitalize">{skinDetails?.skinType || "Normal"}</div>
                                </div>

                                {[
                                    { label: "Hydration Level", value: 35, color: "bg-[#DE7983]" },
                                    { label: "Oil Balance", value: 25, color: "bg-[#ECA38A]" },
                                    { label: "Skin Health Score", value: 72, color: "bg-[#DE7983]", max: 100 }
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#8C8181] mb-2">
                                            <span>{stat.label}</span>
                                            <span>{stat.value}{stat.max ? `/${stat.max}` : "%"}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-rose-50 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.max ? (stat.value / stat.max) * 100 : stat.value}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full ${stat.color} rounded-full`}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#8C8181] mb-2">
                                        <span>Key Concerns</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(skinDetails?.concerns || ["Dryness"]).map((c: string) => (
                                            <span key={c} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-[#DE7983] border border-rose-100">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recommendations Title */}
                    <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-[#402F26]">Recommended Products</h2>
                            <p className="text-[#8C8181] mt-1 italic">Based on your skin profile and budget</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#8C8181] shadow-sm border border-rose-50">
                            <Calendar className="h-3.5 w-3.5" />
                            Total: ~${totalCost}/month
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        {uniqueProducts.map((product: any, idx: number) => (
                            <motion.div
                                key={`${product.id}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => setSelectedProduct(product)}
                                className={`relative rounded-[32px] p-8 border cursor-pointer hover:shadow-lg transition-all ${getCategoryStyles(product.type)}`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <span className="rounded-full bg-white/60 backdrop-blur-sm px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {product.type || "General"}
                                    </span>
                                    <span className="text-xl font-bold">~${product.price || 0}</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#402F26] mb-1 leading-tight">{product.name}</h3>
                                <p className="text-sm font-medium opacity-70 mb-4">{product.brand}</p>
                                <p className="text-xs text-[#8C8181] leading-relaxed line-clamp-2 mb-4">
                                    {product.description}
                                </p>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent("site:amazon.com " + product.brand + " " + product.name)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DE7983] hover:underline"
                                >
                                    <span className="bg-white/50 px-2 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Buy on Amazon
                                    </span>
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Build Routine CTA - Moved up slightly to sit between lists if needed, or keep at bottom */}
                    <div className="flex flex-col items-center mb-16">
                        <button
                            onClick={handleBuildRoutine}
                            className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-12 py-5 text-lg font-bold text-white shadow-xl shadow-rose-200 transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                        >
                            Build My Routine
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                        </button>
                        <p className="mt-6 text-sm text-[#8C8181]">
                            Save these products to your daily routine checklist
                        </p>
                    </div>

                    {/* Lifestyle Tips Section */}
                    <div className="mb-20">
                        <h2 className="font-serif text-3xl font-bold text-[#402F26] mb-8 text-center">Lifestyle & Wellness Tips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getLifestyleTips(skinDetails?.skinType || "normal", skinDetails?.concerns || []).map((tip, idx) => (
                                <motion.div
                                    key={tip.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    className="rounded-[32px] bg-white p-8 shadow-lg shadow-rose-50 border border-rose-50"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-[#DE7983]">
                                            {tip.icon === "Droplets" && <Droplets className="h-6 w-6" />}
                                            {tip.icon === "Utensils" && <Utensils className="h-6 w-6" />}
                                            {tip.icon === "Moon" && <Moon className="h-6 w-6" />}
                                            {tip.icon === "Sun" && <Sun className="h-6 w-6" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-widest text-[#DE7983] mb-1">{tip.category}</div>
                                            <h3 className="text-xl font-bold text-[#402F26]">{tip.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-[#8C8181] leading-relaxed">
                                        {tip.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer matching Analyze page */}
                <footer className="bg-white py-16 border-t border-rose-100/50">
                    <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <span className="font-serif text-xl font-bold text-[#402F26]">GlowAI</span>
                            </div>
                            <p className="text-sm text-[#8C8181] leading-relaxed">
                                AI-powered personalized skincare recommendations.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#402F26] mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-sm text-[#8C8181]">
                                <li><Link to="/analyze" className="hover:text-[#DE7983]">Skin Analysis</Link></li>
                                <li><Link to="/routine" className="hover:text-[#8C8181] hover:text-[#402F26]">My Routine</Link></li>
                                <li><Link to="/products" className="hover:text-[#8C8181] hover:text-[#402F26]">Products</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#402F26] mb-6">Support</h4>
                            <ul className="space-y-4 text-sm text-[#8C8181]">
                                <li><Link to="#" className="hover:text-[#DE7983]">FAQ</Link></li>
                                <li><Link to="#" className="hover:text-[#DE7983]">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#402F26] mb-6">Connect</h4>
                            <Link to="/chat" className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#DE7983] hover:bg-[#DE7983] hover:text-white transition-all cursor-pointer">
                                <Bot className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </footer>
                {/* Product Detail Modal */}
                <AnimatePresence>
                    {selectedProduct && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProduct(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-5xl overflow-hidden rounded-[40px] bg-white shadow-2xl max-h-[90vh] overflow-y-auto"
                            >
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute right-6 top-6 z-10 rounded-full bg-white/80 p-2 text-gray-500 backdrop-blur-sm hover:bg-gray-100"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="grid md:grid-cols-2">
                                    {/* Left: Main Product Image */}
                                    <div className="bg-[#FAEEEA] p-12 flex items-center justify-center">
                                        <img
                                            src={selectedProduct.imageUrl}
                                            alt={selectedProduct.name}
                                            className="max-h-[400px] w-full object-contain mix-blend-multiply drop-shadow-xl"
                                        />
                                    </div>

                                    {/* Right: Details */}
                                    <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-[800px]">
                                        <div className="mb-2 text-sm font-bold uppercase text-[#DE7983]">{selectedProduct.brand}</div>
                                        <h2 className="font-serif text-3xl font-bold text-[#402F26] mb-4">{selectedProduct.name}</h2>
                                        <p className="text-[#8C8181] mb-6 border-b border-gray-100 pb-6">{selectedProduct.description}</p>

                                        <div className="mb-8 flex items-center gap-4">
                                            <div className="text-3xl font-bold text-[#402F26]">${selectedProduct.price}</div>
                                        </div>

                                        {/* Benefits Section */}
                                        {selectedProduct.benefits && (
                                            <div className="mb-6">
                                                <h3 className="flex items-center gap-2 font-bold text-[#402F26] mb-3">
                                                    <Sparkles className="h-4 w-4 text-[#DE7983]" />
                                                    Key Benefits
                                                </h3>
                                                <ul className="space-y-2">
                                                    {selectedProduct.benefits.map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-[#8C8181]">
                                                            <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Ingredients Section */}
                                        {selectedProduct.ingredients && (
                                            <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                                                <h3 className="flex items-center gap-2 font-bold text-[#402F26] mb-3">
                                                    <Leaf className="h-4 w-4 text-emerald-600" />
                                                    Star Ingredients
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.ingredients.map((ing, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                                                            {ing}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {isProductInRoutine(selectedProduct.id) ? (
                                            <div className="w-full rounded-2xl bg-gray-100 py-4 text-center font-bold text-gray-400 flex items-center justify-center gap-2">
                                                <ShieldCheck className="h-5 w-5" />
                                                Already in Routine
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => promptAddToRoutine(selectedProduct)}
                                                className="w-full rounded-2xl bg-[#DE7983] py-4 text-center font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                Add to Routine
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Similar Products Section */}
                                {(() => {
                                    const similar = getSimilarProducts(selectedProduct, skinDetails?.budget || "balanced", 2);
                                    if (similar.length === 0) return null;
                                    return (
                                        <div className="border-t border-gray-100 bg-gray-50/50 p-8 md:p-12">
                                            <h3 className="font-serif text-xl font-bold text-[#402F26] mb-6">Similar Alternatives For You</h3>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {similar.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:border-[#DE7983]/30 transition-all cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedProduct(p);
                                                        }}
                                                    >
                                                        <div className="h-16 w-16 shrink-0 rounded-xl bg-[#FAEEEA] p-2">
                                                            <img src={p.imageUrl} className="h-full w-full object-contain mix-blend-multiply" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-bold text-[#8C8181]">{p.brand}</div>
                                                            <div className="font-bold text-[#402F26] truncate">{p.name}</div>
                                                            <div className="text-sm text-[#DE7983]">${p.price}</div>
                                                        </div>
                                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Confirmation Prompt Modal */}
                <AnimatePresence>
                    {showConfirm && productToConfirm && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl text-center"
                            >
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-[#DE7983]">
                                    <HelpCircle className="h-8 w-8" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-[#402F26] mb-4">Update Your Routine?</h3>
                                <p className="text-[#8C8181] mb-8 leading-relaxed">
                                    Are you sure you want to add <strong>{productToConfirm.name}</strong> to your routine? This will replace your current {productToConfirm.type}.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-500 transition-colors hover:bg-gray-200"
                                    >
                                        No, Keep Current
                                    </button>
                                    <button
                                        onClick={() => handleUpdateRoutine(productToConfirm)}
                                        className="flex-1 rounded-2xl bg-[#DE7983] py-4 font-bold text-white shadow-lg shadow-rose-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Yes, Update
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
