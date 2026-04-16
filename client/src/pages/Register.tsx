import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, ArrowLeft, Upload, User, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        password: "",
        skinDiseases: "",
        medications: "",
        profilePicture: ""
    });
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePic(file);

            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.register(formData);
            // Store email in local storage to use in Verify OTP page
            localStorage.setItem("registrationEmail", formData.email);
            alert(response.message || "OTP sent to your email! Please check your inbox.");
            navigate("/verify-otp");
        } catch (error: any) {
            alert(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-body text-[#402F26] flex items-center justify-center p-4 relative overflow-hidden">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/assets/register-bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-rose-50/20 backdrop-blur-[3px]" />
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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl relative z-10"
            >
                <div className="mb-8 flex justify-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 text-white shadow-xl">
                            <Sparkles className="h-6 w-6 text-[#402F26]" />
                        </div>
                        <div className="font-serif text-3xl font-bold tracking-tight text-[#402F26] drop-shadow-sm">
                            GlowAI
                        </div>
                    </Link>
                </div>

                <div className="rounded-[48px] bg-white/60 backdrop-blur-xl border border-white/50 p-8 md:p-12 shadow-2xl shadow-rose-900/10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <div className="mb-8 text-center">
                        <h1 className="font-serif text-3xl font-bold text-[#402F26]">Create Account</h1>
                        <p className="mt-2 text-[#402F26]/70 font-medium">Join us for a personalized skincare journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative cursor-pointer group"
                            >
                                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white/50 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                                    {profilePic ? (
                                        <img
                                            src={URL.createObjectURL(profilePic)}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 text-[#DE7983]" />
                                    )}
                                </div>
                                <div className="absolute bottom-1 right-1 rounded-full bg-[#DE7983] p-2 text-white shadow-md transition-transform group-hover:scale-110 border-2 border-white">
                                    <Upload className="h-3.5 w-3.5" />
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-xs font-bold text-[#DE7983]">Tap to upload photo</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#402F26] ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jane Doe"
                                    className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#402F26] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="jane@example.com"
                                    className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Age */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#402F26] ml-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    placeholder="25"
                                    min="13"
                                    max="120"
                                    className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#402F26] ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#402F26] ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Health Information */}
                        <div className="space-y-6 pt-4 border-t border-white/40">
                            <h3 className="font-serif text-lg font-bold text-[#402F26] flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#DE7983]" />
                                Health Profile
                            </h3>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#402F26] ml-1">Skin Diseases / Conditions</label>
                                    <textarea
                                        name="skinDiseases"
                                        value={formData.skinDiseases}
                                        onChange={handleChange}
                                        placeholder="E.g. Eczema, Psoriasis..."
                                        className="w-full h-32 rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all resize-none shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#402F26] ml-1 flex items-center gap-2">
                                        Current Medications
                                    </label>
                                    <textarea
                                        name="medications"
                                        value={formData.medications}
                                        onChange={handleChange}
                                        placeholder="E.g. Accutane..."
                                        className="w-full h-32 rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#DE7983]/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                            <p className="mt-6 text-center text-sm font-medium text-[#402F26]/60">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
