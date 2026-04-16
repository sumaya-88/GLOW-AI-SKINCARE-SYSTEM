import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
    User,
    Mail,
    Camera,
    AlertCircle,
    LogOut,
    Save,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        skinType: "",
        currentlyUsing: "",
        skinIssues: "",
        medications: "",
        profilePicture: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setFormData(prev => ({ ...prev, profilePicture: dataUrl }));
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();
                setUser(data);
                setFormData({
                    name: data.name || "",
                    age: data.age || "",
                    skinType: data.skinType || "Normal",
                    currentlyUsing: data.currentlyUsing || "",
                    skinIssues: data.skinIssues || "",
                    medications: data.medications || "",
                    profilePicture: data.profilePicture || ""
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
        fetchProfile();
    }, [navigate]);

    // Sync Routine Data if currentlyUsing is empty
    useEffect(() => {
        if (user && !user.currentlyUsing) {
            const savedRoutine = localStorage.getItem("glowai_routine");
            if (savedRoutine) {
                try {
                    const parsedRoutine = JSON.parse(savedRoutine);
                    // Extract product names from routine steps
                    const products: string[] = [];
                    if (parsedRoutine.dayRoutine) {
                        products.push(...parsedRoutine.dayRoutine.map((p: any) => p.name));
                    }
                    if (parsedRoutine.nightRoutine) {
                        products.push(...parsedRoutine.nightRoutine.map((p: any) => p.name));
                    }

                    if (products.length > 0) {
                        const uniqueProducts = Array.from(new Set(products)).join(", ");
                        setFormData(prev => ({ ...prev, currentlyUsing: uniqueProducts }));
                        // Optional: Auto-save to backend? For now just show in UI to allow user to save.
                    }
                } catch (e) {
                    console.error("Failed to parse routine for sync", e);
                }
            }
        }
    }, [user]);



    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await api.updateProfile(formData);
            const updatedUser = response.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMode("view");
        } catch (error: any) {
            alert(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAEEEA] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#DE7983] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-body text-[#402F26] relative">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/profile-bg-custom.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[6px]" />
            </div>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm relative z-10">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </Link>
                        <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 rounded-full bg-white/50 px-5 py-2.5 text-sm font-bold text-[#402F26] shadow-sm ring-1 ring-rose-100/50 transition-all hover:bg-rose-50 hover:text-[#DE7983] active:scale-95"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-full bg-[#402F26] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-95"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-[40px] bg-white border border-rose-100 shadow-2xl shadow-rose-900/5"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-rose-100/50 to-orange-100/50 -z-0" />

                    <div className="relative z-10 px-8 py-10 md:p-12">
                        {/* Profile Top Section */}
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full border-8 border-white bg-[#FAEEEA] overflow-hidden shadow-xl">
                                    {user?.profilePicture || formData.profilePicture ? (
                                        <img src={user?.profilePicture || formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-20 h-20 text-[#DE7983] opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    )}
                                </div>
                                {mode === "edit" && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 p-3 bg-[#DE7983] rounded-full shadow-lg text-white border-4 border-white hover:scale-110 active:scale-90 transition-all"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h1 className="font-serif text-4xl font-bold text-[#402F26] mb-2">{user?.name}</h1>
                                <p className="text-[#8C8181] font-medium flex items-center justify-center md:justify-start gap-2 mb-4">
                                    <Mail className="w-4 h-4" />
                                    {user?.email}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-4 py-1.5 rounded-full bg-rose-50 text-[#DE7983] text-xs font-black uppercase tracking-widest border border-rose-100">
                                        Member since {new Date(parseInt(user?.id || Date.now().toString())).getFullYear()}
                                    </span>
                                    {mode === "view" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setMode("edit")}
                                                className="flex items-center gap-2 px-6 py-1.5 rounded-full bg-[#402F26] text-white text-xs font-bold transition-all hover:bg-black active:scale-95"
                                            >
                                                <Save className="w-3 h-3" />
                                                Edit Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <AnimatePresence mode="wait">
                            {mode === "view" ? (
                                <motion.div
                                    key="view"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                >
                                    <div
                                        id="skin-id-card"
                                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-white rounded-[32px]"
                                    >
                                        {/* Left Sidebar - Personal Stats */}
                                        <div className="lg:col-span-1 space-y-6">
                                            <div className="p-6 rounded-[32px] bg-rose-50/50 border border-rose-100">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-[#DE7983] mb-6 flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Personal Stats
                                                </h3>
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                                                        <span className="text-sm font-bold text-[#8C8181]">Age</span>
                                                        <span className="text-lg font-black text-[#402F26]">{(user?.age || formData.age) ? (user?.age || formData.age) : "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                                                        <span className="text-sm font-bold text-[#8C8181]">Skin Type</span>
                                                        <span className="text-lg font-black text-[#402F26]">{user?.skinType || "Normal"}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-[#8C8181] block mb-2">Primary Concerns</span>
                                                        <div className="inline-block px-3 py-1 bg-white rounded-lg border border-rose-100 text-[#402F26] font-bold text-sm">
                                                            {user?.skinIssues || "None"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Content - Medical & Routine */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="p-8 rounded-[32px] bg-white border border-rose-100 shadow-sm">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-[#DE7983] mb-6 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Medical History
                                                </h3>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div>
                                                        <p className="text-xs font-bold text-[#8C8181] uppercase tracking-wider mb-2">Medications</p>
                                                        <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-50 min-h-[80px]">
                                                            {user?.medications ? (
                                                                <p className="text-[#402F26] font-medium leading-relaxed">{user.medications}</p>
                                                            ) : (
                                                                <p className="text-[#8C8181] italic text-sm">No medications listed</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#8C8181] uppercase tracking-wider mb-2">Known Conditions</p>
                                                        <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-50 min-h-[80px]">
                                                            {/* skinIssues is mapped from skinDiseases */}
                                                            {user?.skinIssues ? (
                                                                <p className="text-[#402F26] font-medium leading-relaxed">{user.skinIssues}</p>
                                                            ) : (
                                                                <p className="text-[#8C8181] italic text-sm">No conditions listed</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 rounded-[32px] bg-amber-50/50 border border-amber-100">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-amber-700 mb-6 flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    Current Routine
                                                </h3>
                                                <div className="min-h-[60px]">
                                                    {user?.currentlyUsing ? (
                                                        <p className="text-[#402F26] font-medium leading-relaxed italic">
                                                            "{user.currentlyUsing}"
                                                        </p>
                                                    ) : (
                                                        <p className="text-[#8C8181] italic">You haven't listed any products yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Edit Form */
                                <motion.form
                                    key="edit"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onSubmit={handleSave}
                                    className="space-y-8 bg-white/50 p-6 md:p-8 rounded-[32px] border border-white/50"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full rounded-2xl bg-rose-50/50 border border-transparent px-5 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Age</label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                className="w-full rounded-2xl bg-rose-50/50 border border-transparent px-5 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner"
                                                placeholder="25"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Photo input is handled via the camera icon above */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Skin Type</label>
                                            <select
                                                value={formData.skinType}
                                                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                                                className="w-full appearance-none rounded-2xl bg-rose-50/50 border border-transparent px-5 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner"
                                            >
                                                <option>Dry</option>
                                                <option>Oily</option>
                                                <option>Combination</option>
                                                <option>Normal</option>
                                                <option>Sensitive</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Skin Issues</label>
                                            <input
                                                type="text"
                                                value={formData.skinIssues}
                                                onChange={(e) => setFormData({ ...formData, skinIssues: e.target.value })}
                                                className="w-full rounded-2xl bg-rose-50/50 border border-transparent px-5 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner"
                                                placeholder="e.g., Acne, Dark Spots"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Medications</label>
                                            <input
                                                type="text"
                                                value={formData.medications}
                                                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                                                className="w-full rounded-2xl bg-rose-50/50 border border-transparent px-5 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner"
                                                placeholder="e.g., Accutane"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#402F26]/60 ml-2">Currently Using Products</label>
                                        <textarea
                                            value={formData.currentlyUsing}
                                            onChange={(e) => setFormData({ ...formData, currentlyUsing: e.target.value })}
                                            rows={3}
                                            className="w-full rounded-3xl bg-rose-50/50 border border-transparent px-6 py-4 font-bold text-[#402F26] focus:bg-white focus:border-[#DE7983] outline-none transition-all shadow-inner resize-none"
                                            placeholder="List any products you are currently using daily..."
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-rose-50">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#DE7983] px-8 py-4 text-base font-black text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("view");
                                                setFormData({
                                                    name: user.name || "",
                                                    age: user.age || "",
                                                    skinType: user.skinType || "Normal",
                                                    currentlyUsing: user.currentlyUsing || "",
                                                    skinIssues: user.skinIssues || "",
                                                    medications: user.medications || "",
                                                    profilePicture: user.profilePicture || ""
                                                });
                                            }}
                                            className="px-8 py-4 rounded-2xl bg-[#FAEEEA] text-[#402F26] font-bold hover:bg-rose-100 transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>


        </div >
    );
}
