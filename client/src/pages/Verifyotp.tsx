import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (e.currentTarget.value === "" && index > 0) {
                const prevInput = e.currentTarget.previousSibling as HTMLInputElement | null;
                if (prevInput) {
                    prevInput.focus();
                }
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        const email = localStorage.getItem("registrationEmail");
        if (!email) {
            alert("Email not found. Please register again.");
            navigate("/register");
            return;
        }

        try {
            const response = await api.verifyOtp(email, otp.join(""));
            alert(response.message || "Email verified successfully! You can now login.");
            localStorage.removeItem("registrationEmail");
            navigate("/login");
        } catch (error: any) {
            alert(error.message || "Verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        const email = localStorage.getItem("registrationEmail");
        if (!email) {
            alert("Email not found. Please register again.");
            navigate("/register");
            return;
        }

        setIsResending(true);
        try {
            await api.resendOtp(email);
            alert("OTP has been resent to your email!");
            setOtp(["", "", "", "", "", ""]);
        } catch (error: any) {
            alert(error.message || "Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAEEEA] font-body text-[#402F26]">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
                <div className="mb-8">
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#8C8181] transition-colors hover:text-[#402F26]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Register
                    </Link>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl shadow-rose-100/50 md:p-10"
                    >
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-[#DE7983]">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h1 className="font-serif text-2xl font-bold text-[#402F26]">Verify Your Account</h1>
                            <p className="mt-2 text-[#8C8181]">Enter the 6-digit code sent to your email</p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="flex justify-center gap-2">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name="otp"
                                        maxLength={1}
                                        value={data}
                                        onChange={e => handleChange(e.target, index)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        onFocus={e => e.target.select()}
                                        className="h-12 w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-xl font-bold text-[#402F26] focus:border-[#DE7983] focus:ring-1 focus:ring-[#DE7983]"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying}
                                className="w-full rounded-full bg-gradient-to-r from-[#DE7983] to-[#F0AF8B] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-rose-200 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70"
                            >
                                {isVerifying ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-[#8C8181]">
                            Didn't receive code?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={isResending}
                                className="font-semibold text-[#DB7082] hover:text-[#DE7983] disabled:opacity-50"
                            >
                                {isResending ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
