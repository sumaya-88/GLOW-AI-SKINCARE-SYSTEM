import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });

      // Store token and user data
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      alert(response.message || "Login successful!");
      navigate("/");
    } catch (error: any) {
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-body text-[#402F26] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/assets/login-bg.png')`,
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
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
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

        {/* Login Card */}
        <div className="rounded-[40px] bg-white/60 backdrop-blur-xl border border-white/50 p-8 md:p-10 shadow-2xl shadow-rose-900/10">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-[#402F26]">Welcome Back</h1>
            <p className="mt-2 text-[#402F26]/70 font-medium">Sign in to continue your skincare journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#402F26] ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-[#402F26]">Password</label>
                <a href="#" className="text-xs font-bold text-[#DE7983] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/50 bg-white/50 px-5 py-4 text-[#402F26] placeholder:text-[#8C8181] focus:border-[#DE7983] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#DE7983]/10 transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#DE7983]/30 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#402F26]/60 font-medium">
              Don’t have an account?{" "}
              <Link to="/register" className="font-bold text-[#DE7983] hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

