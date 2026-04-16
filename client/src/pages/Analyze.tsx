import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Camera, X, Sparkles, Bot, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

type Step = "upload" | "details" | "analysis";

interface SkinDetails {
  skinType: string;
  concerns: string[];
  additionalNotes: string;
  budget: string;
}

type PhotoAngle = "front" | "left" | "right";

export default function Analyze() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [photos, setPhotos] = useState<Record<PhotoAngle, string | null>>({
    front: null,
    left: null,
    right: null,
  });
  const [activeAngle, setActiveAngle] = useState<PhotoAngle>("front");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [skinDetails, setSkinDetails] = useState<SkinDetails>({
    skinType: "",
    concerns: [],
    additionalNotes: "",
    budget: "",
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (currentStep === "analysis") {
      const timer = setTimeout(async () => {
        // Save to localStorage for persistence across refreshes
        localStorage.setItem("glowai_skin_details", JSON.stringify(skinDetails));
        localStorage.setItem("glowai_photos", JSON.stringify(photos));

        // Sync with backend profile
        try {
          await api.updateProfile({
            skinType: skinDetails.skinType,
            skinIssues: skinDetails.concerns.join(", "),
            // routine/budget can be stored in additional notes or skipped for now if no direct mapping
          });
        } catch (error) {
          console.error("Failed to sync analysis to profile", error);
          // Continue anyway so user sees results
        }

        navigate("/results", { state: { skinDetails, photos } });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate, skinDetails, photos]);

  // Camera functions
  async function startCamera() {
    try {
      stopCamera(); // Clean up existing stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      // Wait for next tick to ensure video element is rendered if it was conditional
      // But we'll change it to be always present for better reliability
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (e: any) {
      console.error("Camera access error:", e);
      alert("Could not access camera. Please allow permission.");
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !streamRef.current) return;
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/webp", 0.8);
      setPhotos(prev => ({ ...prev, [activeAngle]: dataUrl }));
      stopCamera();
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

    if (file.size > 5 * 1024 * 1024) {
      alert("File size is too large. Please upload an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotos(prev => ({ ...prev, [activeAngle]: dataUrl }));
        // Ensure camera is stopped if it was running
        stopCamera();
      }
    };
    reader.onerror = (err) => {
      console.error("Error reading file:", err);
      alert("Failed to read file.");
    };
    reader.readAsDataURL(file);

    // Reset inputs so the same file can be selected again if needed
    e.target.value = "";
  }

  function toggleConcern(concern: string) {
    setSkinDetails((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  }

  const skinConcerns = [
    "Acne & Breakouts", "Dark Spots", "Fine Lines", "Large Pores",
    "Dullness", "Redness", "Uneven Texture", "Dark Circles",
    "Dryness", "Oiliness", "Blackheads", "Sun Damage",
  ];

  const allPhotosCaptured = photos.front && photos.left && photos.right;

  return (
    <div className="min-h-screen font-body text-[#402F26] relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/assets/analyze-bg-custom.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-rose-50/20 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#E38786] to-[#ECA38A] text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#402F26]">GlowAI</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Home</Link>
              <Link to="/analyze" className="text-sm font-medium text-[#DE7983]">Analyze</Link>
              <Link to="/routine" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Routine</Link>
              <Link to="/products" className="text-sm font-medium text-[#8C8181] hover:text-[#402F26]">Products</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-full bg-white/50 px-5 py-2.5 text-sm font-bold text-[#402F26] shadow-sm ring-1 ring-rose-100/50 transition-all hover:bg-rose-50 hover:text-[#DE7983] hover:ring-rose-200 hover:shadow-md active:scale-95"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 pt-12 pb-24">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-medium text-[#DE7983] mb-6 border border-rose-100">
              <Sparkles className="h-3.5 w-3.5" />
              AI Skin Analysis
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#402F26] mb-4">
              {currentStep === "upload" && "Analyze Your Skin"}
              {currentStep === "details" && "Tell Us More"}
              {currentStep === "analysis" && "Analyzing..."}
            </h1>
          </div>

          {/* Progress Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[
              { id: "upload", label: "Photos" },
              { id: "details", label: "Details" },
              { id: "analysis", label: "Result" }
            ].map((s) => {
              const isActive = currentStep === s.id;
              const isPast = (currentStep === "details" && s.id === "upload") ||
                (currentStep === "analysis" && (s.id === "upload" || s.id === "details"));
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 group">
                  <div className={`h-2 w-20 rounded-full transition-all duration-500 ${isActive || isPast ? "bg-[#DE7983]" : "bg-white border border-rose-50"}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive || isPast ? "text-[#DE7983]" : "text-[#8C8181]"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {currentStep === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="rounded-[40px] bg-white p-8 md:p-12 shadow-xl shadow-rose-100/50 mb-8 text-center">
                  <div className="flex justify-center gap-4 mb-8">
                    {(["front", "left", "right"] as PhotoAngle[]).map((angle) => (
                      <button
                        key={angle}
                        onClick={() => {
                          setActiveAngle(angle);
                        }}
                        className={`relative h-24 w-24 rounded-2xl border-2 transition-all overflow-hidden ${activeAngle === angle ? "border-[#DE7983] ring-4 ring-rose-50" : "border-rose-100 hover:border-rose-200"}`}
                      >
                        {photos[angle] ? (
                          <img src={photos[angle]!} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center bg-rose-50/50">
                            <Camera className="h-6 w-6 text-[#DE7983] opacity-40" />
                            <span className="mt-1 text-[10px] font-bold uppercase text-[#DE7983]">{angle}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative aspect-square w-full max-w-md mx-auto rounded-[32px] overflow-hidden bg-rose-50/30 border-2 border-dashed border-rose-100 mb-8 flex items-center justify-center">
                    {/* Video element always in DOM to resolve ref issues */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`absolute inset-0 h-full w-full object-cover rounded-[30px] transition-opacity duration-300 ${isCameraActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    />

                    {isCameraActive && (
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-10">
                        <button
                          onClick={capturePhoto}
                          className="h-16 w-16 rounded-full bg-white shadow-xl flex items-center justify-center text-[#DE7983] hover:scale-110 active:scale-95 transition-all"
                          title="Capture"
                        >
                          <div className="h-12 w-12 rounded-full border-4 border-[#DE7983]" />
                        </button>
                        <button
                          onClick={stopCamera}
                          className="h-16 w-16 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 hover:bg-black/40 transition-all"
                          title="Cancel"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    )}
                    {!isCameraActive ? (
                      photos[activeAngle] ? (
                        <div className="relative h-full w-full p-4">
                          <img src={photos[activeAngle]!} className="h-full w-full object-cover rounded-[28px]" />
                          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4">
                            <button
                              onClick={() => startCamera()}
                              className="rounded-full bg-white/90 px-6 py-2.5 text-sm font-bold text-[#DE7983] shadow-lg backdrop-blur"
                            >
                              Retake
                            </button>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-full bg-white/90 px-6 py-2.5 text-sm font-bold text-[#8C8181] shadow-lg backdrop-blur"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-6">
                          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-md">
                            <Camera className="h-10 w-10 text-[#DE7983]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#402F26]">Take your {activeAngle} view</h3>
                            <p className="text-sm text-[#8C8181] mt-1">Position your face clearly in the frame</p>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={startCamera}
                              className="rounded-2xl bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-8 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                            >
                              Open Camera
                            </button>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-2xl border-2 border-rose-100 bg-white px-8 py-3 text-sm font-bold text-[#DE7983] hover:bg-rose-50 transition-all"
                            >
                              Upload File
                            </button>
                          </div>
                        </div>
                      )
                    ) : null}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </div>

                  <button
                    onClick={() => setCurrentStep("details")}
                    disabled={!allPhotosCaptured}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] py-5 text-lg font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Details
                    <Sparkles className="h-5 w-5" />
                  </button>
                  {!allPhotosCaptured && (
                    <p className="mt-4 text-xs text-[#8C8181] font-medium uppercase tracking-widest">
                      Please take all 3 photos (Front, Left, Right) to continue
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="rounded-[40px] bg-white p-10 shadow-xl shadow-rose-100/50">
                  <h3 className="text-2xl font-serif font-bold text-[#402F26] mb-2">What's Your Skin Type?</h3>
                  <p className="text-sm text-[#8C8181] mb-8">Select the option that best describes your skin on most days.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: "oily", label: "Oily", sub: "Shiny, enlarged pores" },
                      { value: "dry", label: "Dry", sub: "Flaky, tight feeling" },
                      { value: "combination", label: "Combination", sub: "Oily T-zone, dry cheeks" },
                      { value: "normal", label: "Normal", sub: "Balanced, few issues" },
                      { value: "sensitive", label: "Sensitive", sub: "Easily irritated, redness" },
                      { value: "not-sure", label: "Not Sure", sub: "Help me figure it out" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSkinDetails((prev) => ({ ...prev, skinType: type.value }))}
                        className={`rounded-2xl border-2 p-6 text-left transition-all ${skinDetails.skinType === type.value
                          ? "border-[#DE7983] bg-rose-50/50 text-[#DE7983]"
                          : "border-rose-50 bg-white text-[#402F26] hover:border-rose-100"
                          }`}
                      >
                        <div className="font-bold text-lg mb-1">{type.label}</div>
                        <div className="text-xs text-[#8C8181] leading-relaxed line-clamp-2">{type.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[40px] bg-white p-10 shadow-xl shadow-rose-100/50">
                  <h3 className="text-2xl font-serif font-bold text-[#402F26] mb-2">What Are Your Skin Concerns?</h3>
                  <p className="text-sm text-[#8C8181] mb-8">Select all that apply. This helps us personalize your recommendations.</p>
                  <div className="flex flex-wrap gap-3">
                    {skinConcerns.map((concern) => (
                      <button
                        key={concern}
                        onClick={() => toggleConcern(concern)}
                        className={`rounded-full px-6 py-3 text-sm font-bold transition-all border-2 ${skinDetails.concerns.includes(concern)
                          ? "bg-[#DE7983] border-[#DE7983] text-white shadow-md shadow-rose-200"
                          : "bg-white border-rose-50 text-[#8C8181] hover:border-rose-100"
                          }`}
                      >
                        {concern}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[40px] bg-white p-10 shadow-xl shadow-rose-100/50">
                  <h3 className="text-2xl font-serif font-bold text-[#402F26] mb-2">Tell Us More (Optional)</h3>
                  <p className="text-sm text-[#8C8181] mb-6">Any additional details about your skin or skincare goals?</p>
                  <textarea
                    value={skinDetails.additionalNotes}
                    onChange={(e) => setSkinDetails(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="E.g., I want to achieve a glowing, even-toned complexion. I've tried retinol before but it made my skin peel..."
                    className="w-full h-40 rounded-3xl border-2 border-rose-50 bg-[#FBF7F6] p-6 text-sm focus:border-[#DE7983] focus:outline-none transition-all resize-none shadow-sm"
                  />
                </div>

                <div className="rounded-[40px] bg-white p-10 shadow-xl shadow-rose-100/50">
                  <h3 className="text-2xl font-serif font-bold text-[#402F26] mb-2">What's Your Budget?</h3>
                  <p className="text-sm text-[#8C8181] mb-8">We'll recommend products that fit your monthly skincare budget.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { value: "value", label: "Value", sub: "$30-50" },
                      { value: "balanced", label: "Balanced", sub: "$50-120" },
                      { value: "premium", label: "Premium", sub: "$120+" },
                    ].map((tier) => (
                      <button
                        key={tier.value}
                        onClick={() => setSkinDetails((prev) => ({ ...prev, budget: tier.value }))}
                        className={`rounded-2xl border-2 p-6 text-left transition-all ${skinDetails.budget === tier.value
                          ? "border-[#DE7983] bg-rose-50/50 text-[#DE7983]"
                          : "border-rose-50 bg-white text-[#402F26] hover:border-rose-100"
                          }`}
                      >
                        <div className="font-bold text-lg mb-1">{tier.label}</div>
                        <div className="text-xs text-[#8C8181] leading-relaxed">{tier.sub}</div>
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border-2 border-rose-50 bg-[#FBF7F6] p-6">
                    <label className="block text-sm font-bold text-[#402F26] mb-2">Or enter a custom budget ($):</label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl font-bold text-[#DE7983]">$</span>
                      <input
                        type="number"
                        placeholder="e.g. 80"
                        value={["value", "balanced", "premium"].includes(skinDetails.budget) ? "" : skinDetails.budget}
                        onChange={(e) => setSkinDetails(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full bg-transparent border-b-2 border-[#DE7983]/30 focus:border-[#DE7983] outline-none py-2 pl-6 text-xl font-bold text-[#DE7983] placeholder:text-[#DE7983]/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setCurrentStep("upload")}
                    className="flex-1 rounded-2xl border-2 border-rose-100 bg-white py-4 text-sm font-bold text-[#8C8181]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep("analysis")}
                    disabled={!skinDetails.skinType}
                    className="flex-[2] rounded-2xl bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] py-4 text-sm font-bold text-white shadow-lg disabled:opacity-40"
                  >
                    Generate Analysis
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === "analysis" && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center py-20"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-rose-100 border-t-[#DE7983] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-[#DE7983] animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-[#402F26] mt-12 mb-4">AI Magic in Progress</h2>
                <p className="text-[#8C8181] text-lg">Analyzing your skin characteristics...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="bg-white py-16 border-t border-rose-100/50 mt-auto">
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
      </div>
    </div>
  );
}
