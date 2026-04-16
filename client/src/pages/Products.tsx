import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Search, ShoppingBag, ExternalLink, Heart, X, Check, ArrowRight, User, Leaf, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, type Product, getSimilarProducts } from "@/lib/skinData";

// Simple Event to open ChatWidget


export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    // Default to 'Recommended' only if we actually have a saved profile
    const savedSkinType = localStorage.getItem("skinType");
    const [activeFilter, setActiveFilter] = useState<string>(!!savedSkinType ? "Recommended" : "All");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [userSkinType, setUserSkinType] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [productToConfirm, setProductToConfirm] = useState<Product | null>(null);
    const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>([]);
    const [results, setResults] = useState<any>(null);

    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        const savedRoutine = localStorage.getItem("glowai_routine");
        const legacySkinType = localStorage.getItem("skinType");

        if (savedRoutine) {
            const parsed = JSON.parse(savedRoutine);
            setResults(parsed);
            if (parsed.skinType) {
                setUserSkinType(parsed.skinType);
                setActiveFilter("Recommended");
            }

            // Extract IDs from routine
            const dayIds = parsed.dayRoutine?.map((p: Product) => p.id) || [];
            const nightIds = parsed.nightRoutine?.map((p: Product) => p.id) || [];
            setRecommendedProductIds([...new Set([...dayIds, ...nightIds])]);
        } else if (legacySkinType) {
            setActiveFilter("Recommended");
            setUserSkinType(legacySkinType);
        } else {
            setActiveFilter("All");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
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
        localStorage.setItem("glowai_routine", JSON.stringify(newResults));
        setSelectedProduct(null);
        setShowConfirm(false);
        setProductToConfirm(null);
    };

    const promptAddToRoutine = (product: Product) => {
        if (isProductInRoutine(product.id)) return;
        setProductToConfirm(product);
        setShowConfirm(true);
    };

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesFilter = false;

            // Normalize user skin type for comparison (hyphen to space)
            const normalizedUserType = (userSkinType || "").toLowerCase().trim().replace("-", " ");

            if (recommendedProductIds.length > 0) {
                if (activeFilter === "Recommended") {
                    matchesFilter = recommendedProductIds.includes(product.id);
                } else if (activeFilter === "Match Type") {
                    matchesFilter = product.suitableFor.some(s => s.toLowerCase().trim().replace("-", " ") === normalizedUserType) ||
                        product.suitableFor.some(s => s.toLowerCase() === "all");
                } else if (activeFilter === "All") {
                    matchesFilter = true;
                } else {
                    matchesFilter = product.type === activeFilter;
                }
            } else {
                if (activeFilter === "All") matchesFilter = true;
                else if (activeFilter === "Recommended" || activeFilter === "Match Type") {
                    matchesFilter = product.suitableFor.some(s => s.toLowerCase().trim().replace("-", " ") === normalizedUserType) ||
                        product.suitableFor.some(s => s.toLowerCase() === "all");
                }
                else matchesFilter = product.type === activeFilter;
            }

            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, userSkinType, recommendedProductIds, activeFilter]);

    return (
        <div className="min-h-screen font-body text-[#402F26] relative">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/products-bg-latest.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[6px]" />
            </div>

            {/* Header */}
            <div className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                                <Sparkles className="h-5 w-5" />
                            </Link>
                            <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Home</Link>
                            <Link to="/analyze" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Analyze</Link>
                            <Link to="/routine" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Routine</Link>
                            <Link to="/products" className="text-sm font-medium text-[#DE7983] font-bold">Products</Link>
                        </nav>
                        <div className="flex items-center gap-3">
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
                                        className="hidden sm:block rounded-full bg-[#402F26] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-95"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 rounded-full bg-white/50 px-5 py-2.5 text-sm font-bold text-[#402F26] shadow-sm ring-1 ring-rose-100/50 transition-all hover:bg-rose-50 hover:text-[#DE7983] hover:ring-rose-200 hover:shadow-md active:scale-95"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                    Back to Home
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-12 relative z-10">
                {/* Search & Filter */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 mb-4">
                        <ShoppingBag className="h-4 w-4" />
                        AI Recommendations
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-[#402F26]">
                        {userSkinType ? `Curated For Your ${userSkinType} Skin` : "Suggested Products"}
                    </h1>
                    <p className="mt-3 text-[#8C8181]">
                        These items were specifically selected by our AI to match your unique skin profile.
                    </p>
                </div>

                <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search suggested products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 py-3 focus:border-[#DE7983] focus:outline-none focus:ring-1 focus:ring-[#DE7983]"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {["Recommended"].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === filter
                                    ? "bg-[#DE7983] text-white shadow-md"
                                    : "bg-white text-[#8C8181] hover:bg-rose-50"
                                    }`}
                            >
                                {filter === "Recommended" && <User className="h-4 w-4" />}
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {/* Removed 'layout' prop to fix "floating not in rhythm" issue. Added simpler hover effects. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative rounded-3xl bg-white/50 backdrop-blur-sm p-4 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col border border-white/60 hover:border-rose-100"
                            >
                                <div className="absolute right-4 top-4 z-10">
                                    <button className="rounded-full bg-white p-2 shadow-sm transition-transform hover:scale-110 hover:text-red-500">
                                        <Heart className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Image Container */}
                                <div className="relative mb-4 w-full pt-[100%] overflow-hidden rounded-2xl bg-[#F8F8F8]">
                                    {product.suitableFor.includes("oily") && (
                                        <div className="absolute left-2 top-2 z-10 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                            {Math.floor(Math.random() * 5) + 95}% Match
                                        </div>
                                    )}
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="absolute inset-0 h-full w-full object-contain mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold uppercase text-[#DE7983]">{product.type}</span>
                                        <span className="text-xs text-[#8C8181]">{product.brand}</span>
                                    </div>
                                    <h3 className="font-serif text-lg font-bold text-[#402F26] leading-tight mb-2 line-clamp-2 min-h-[48px]">
                                        {product.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.concerns.slice(0, 2).map((c, i) => (
                                            <span key={i} className="rounded-md bg-gray-50 px-2 py-1 text-[10px] text-gray-500">
                                                {c}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-xs font-bold text-[#402F26]">4.8</span>
                                        </div>
                                        <div className="text-lg font-bold text-[#402F26]">${product.price}</div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="mt-4 w-full rounded-xl bg-rose-50 py-3 text-sm font-bold text-[#DE7983] transition-colors flex items-center justify-center gap-2 group-hover:bg-[#DE7983] group-hover:text-white hover:!bg-[#DE7983] hover:!text-white"
                                    >
                                        View Details
                                        <ExternalLink className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[#402F26]">No products found</h3>
                        <p className="text-[#8C8181]">
                            {activeFilter === "Recommended" && !userSkinType
                                ? "Complete the skin analysis to get personalized recommendations."
                                : "Try adjusting your search or filters."}
                        </p>
                        {activeFilter === "Recommended" && !userSkinType ? (
                            <Link
                                to="/analyze"
                                className="mt-4 inline-block rounded-full bg-[#DE7983] px-6 py-2 text-sm font-bold text-white shadow-md hover:shadow-lg"
                            >
                                Start Analysis
                            </Link>
                        ) : (
                            <button
                                onClick={() => { setSearchTerm(""); setActiveFilter("All"); }}
                                className="mt-4 text-[#DE7983] font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

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
                                const similar = getSimilarProducts(selectedProduct, "balanced", 2);
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
    );
}
