import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Camera,
  Sparkles,
  ShoppingBag,
  Calendar,
  MessageCircle,
  Utensils,
  FileText,
  Search,
  Heart,
  Clock,
  ArrowRight,
  Menu,
  X,
  Bot,
  User
} from "lucide-react";

// Simple Event to open ChatWidget


export default function Index() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-body text-stone-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#402F26]">GlowAI</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#8C8181] md:flex">
            <Link to="/" className="text-[#DB7082]">Home</Link>
            <button onClick={() => navigate(user ? "/analyze" : "/login")} className="transition-colors hover:text-[#402F26]">Analyze</button>
            <button onClick={() => navigate(user ? "/routine" : "/login")} className="transition-colors hover:text-[#402F26]">Routine</button>
            <Link to="/products" className="transition-colors hover:text-[#402F26]">Products</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/chat"
              className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2.5 text-sm font-bold text-[#DE7983] transition-colors hover:bg-rose-100"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full bg-white/50 px-4 py-2.5 text-sm font-bold text-[#402F26] shadow-sm ring-1 ring-rose-100/50 transition-all hover:bg-rose-50 hover:text-[#DE7983]"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[#402F26] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-black active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-[#8C8181] transition-colors hover:text-[#402F26]">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-[#402F26] hover:bg-rose-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white shadow-xl md:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between border-b border-rose-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="font-serif text-2xl font-bold tracking-tight text-[#402F26]">GlowAI</div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Sidebar Links */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <nav className="flex flex-col gap-6 text-lg font-medium">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#DB7082]">
                      Home
                    </Link>
                    <Link to="/analyze" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8C8181] hover:text-[#402F26]">
                      Analyze
                    </Link>
                    <Link to="/routine" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8C8181] hover:text-[#402F26]">
                      Routine
                    </Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-[#8C8181] hover:text-[#402F26]">
                      Products
                    </Link>
                  </nav>

                  <div className="mt-8 border-t border-rose-100 pt-8">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mb-4 block text-center text-sm font-medium text-[#8C8181] hover:text-[#402F26]"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-6 py-3.5 text-center text-base font-semibold text-white shadow-md transition-all active:scale-95"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-20">
          {/* Background Gradient Blob */}
          <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[#FAEEEA] blur-3xl filter" />

          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F9DEE3] px-4 py-1.5 text-sm font-medium text-[#AD3C4E]">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Skincare Analysis</span>
              </div>

              <h1 className="mt-8 font-serif text-4xl font-bold leading-[1.1] text-[#402F26] md:text-6xl lg:text-7xl">
                Your Perfect <span className="text-[#DB7082]">Skincare</span>
                <br />
                Routine Awaits
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#8C8181]">
                Upload a selfie, tell us about your skin, and let AI craft a
                personalized routine with budget-friendly product recommendations
                tailored just for you.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate(user ? "/analyze" : "/login")}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Camera className="h-5 w-5" />
                  Start Your Analysis
                </button>
                {!user && (
                  <Link to="/register" className="rounded-full border border-[#F5E0E0] bg-white px-8 py-3.5 text-base font-semibold text-[#8C8181] transition-all hover:bg-[#FAEEEA]">
                    Get Started
                  </Link>
                )}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-[#F5E0E0] pt-8 text-sm font-medium text-[#93796C]">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 stroke-[#DB7082] stroke-2 text-transparent" />
                  <span>10k+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#DB7082]" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#DB7082]" />
                  <span>2 Min Analysis</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[550px]"
            >
              <div className="relative rounded-[40px] bg-transparent">
                {/* Local generated image */}
                <img
                  src="/hero-image.png"
                  alt="Skincare Products"
                  className="h-auto w-full rounded-[40px] shadow-2xl"
                />

                {/* Floating Elements */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute left-4 top-20 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm md:-left-8"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-800">Skin Analysis</div>
                    <div className="text-xs font-medium text-stone-500">Complete</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-20 right-4 flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur-sm md:-right-8"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-500">
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-stone-800">98% Match</div>
                    <div className="text-xs font-medium text-stone-500">For your skin</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-16 text-center"
            >
              <h2 className="font-serif text-4xl font-medium text-stone-900 md:text-5xl">Everything Your Skin Needs</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-500">
                From analysis to action—our comprehensive platform guides you through every step of your skincare journey.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Feature Cards - Using specific colors from design */}
              <FeatureCard
                icon={<Camera />}
                title="Photo Analysis"
                desc="Upload a selfie and let our AI analyze your skin's unique characteristics and concerns."
                color="bg-rose-50"
                iconColor="text-rose-500"
              />
              <FeatureCard
                icon={<Sparkles />}
                title="AI-Powered Insights"
                desc="Get a detailed skin report with personalized recommendations based on advanced analysis."
                color="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <FeatureCard
                icon={<ShoppingBag />}
                title="Budget-Friendly Products"
                desc="Receive product suggestions that match your budget with clear explanations of benefits."
                color="bg-orange-50"
                iconColor="text-orange-600"
              />
              <FeatureCard
                icon={<Calendar />}
                title="Routine Planning"
                desc="Build custom AM/PM routines with step-by-step guidance and daily reminders."
                color="bg-blue-50"
                iconColor="text-blue-600"
              />
              <FeatureCard
                icon={<MessageCircle />}
                title="Feedback Loop"
                desc="Report your results and get adjusted recommendations that evolve with your skin."
                color="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <FeatureCard
                icon={<Utensils />}
                title="Lifestyle Tips"
                desc="Discover food and wellness suggestions that support healthy, glowing skin."
                color="bg-rose-50"
                iconColor="text-rose-500"
              />
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-rose-50/50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="mb-20 text-center"
            >
              <h2 className="font-serif text-4xl font-medium text-stone-900">How It Works</h2>
              <p className="mt-4 text-stone-500">Your journey to better skin starts with just a few simple steps.</p>
            </motion.div>

            <div className="grid gap-12 md:grid-cols-4">
              <StepItem number="01" icon={<Camera className="h-6 w-6" />} title="Upload Your Selfie" desc="Take a clear photo of your face and share your skin concerns with us." />
              <StepItem number="02" icon={<FileText className="h-6 w-6" />} title="Get Your Analysis" desc="Our AI analyzes your skin type, concerns, and creates a detailed report." />
              <StepItem number="03" icon={<Search className="h-6 w-6" />} title="Discover Products" desc="Receive personalized product recommendations within your budget." />
              <StepItem number="04" icon={<Calendar className="h-6 w-6" />} title="Start Your Routine" desc="Follow your custom AM/PM routine with reminders to stay consistent." />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-rose-400 to-orange-300 px-6 py-20 text-center shadow-2xl shadow-rose-200"
            >
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="font-serif text-4xl font-medium text-white md:text-5xl">
                  Ready to Transform <br /> Your Skincare?
                </h2>
                <p className="mt-6 text-lg text-rose-50">
                  Join thousands of users who have discovered their perfect skincare routine with personalized AI recommendations.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate(user ? "/analyze" : "/login")}
                    className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-rose-500 shadow-md transition-transform hover:scale-105 active:scale-95"
                  >
                    <Camera className="h-5 w-5" />
                    Start Free Analysis
                  </button>
                  <button className="flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                    View Demo <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            </motion.div>
          </div>
        </section>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-stone-100 bg-white py-12 text-center text-sm text-stone-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-serif font-bold text-stone-900">
            <span className="text-xl">GlowAI</span>
          </div>
          <p>© 2024 GlowAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


function FeatureCard({ icon, title, desc, color, iconColor }: { icon: any, title: string, desc: string, color: string, iconColor: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className={`group rounded-3xl ${color} p-8 shadow-sm transition-all hover:shadow-md`}
    >
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 ${iconColor} shadow-sm backdrop-blur-sm`}>
        {icon}
      </div>
      <h3 className="mb-3 font-serif text-xl font-bold text-stone-900">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-500">{desc}</p>
    </motion.div>
  )
}

function StepItem({ number, icon, title, desc }: { number: string, icon: any, title: string, desc: string }) {
  return (
    <div className="relative text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-sm">
        {icon}
      </div>
      <div className="absolute -right-4 -top-2 h-8 w-8 rounded-full bg-white text-xs font-bold leading-8 text-rose-300 shadow-sm content-center border border-rose-100">
        {number}
      </div>
      <h3 className="mb-2 mt-4 font-serif text-lg font-bold text-stone-900">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-500">{desc}</p>
    </div>
  )
}
