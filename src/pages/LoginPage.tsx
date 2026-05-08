import { Shield, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { SYSTEM_CONFIG } from "@/lib/constants";
import emailjs from "@emailjs/browser";

import { supabase, logActivity } from "@/lib/supabase";
import { toast } from "sonner";

const LoginPage = ({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<"login" | "reset" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both ID and Key");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Standard Password Authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Step 2: Generate and Send OTP via EmailJS for 2FA
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);

      const templateParams = {
        from_name: "Neon Watchdog Security",
        to_email: email,
        passcode: newOtp,
        time: new Date().toLocaleTimeString(),
        message: `Security Alert: A login attempt was detected. Your verification code is ${newOtp}`
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        toast.success("Two-step verification code dispatched!");
        setStage("otp");
      } else {
        throw new Error("Dispatch failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      await logActivity("Failed Login Attempt", `Email: ${email}`, "warning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      toast.error("Invalid verification code");
      return;
    }

    setIsLoading(true);
    try {
      if (stage === "otp" && isResetSent) {
        toast.success("Identity verified. Access granted for recovery.");
        toast.info("Please update your Access Key in Settings immediately.", { duration: 6000 });
      } else {
        toast.success("Identity verified. Welcome back, Admin.");
      }
      await logActivity("Admin Login", `Email: ${email} verified with OTP`, "success");
      onLogin();
    } catch (error: any) {
      toast.error("Session initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent to your email!");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsLoading(true);
    try {
      // Step 1: Generate a unique Reset OTP
      const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(resetOtp);

      // Step 2: Send via EmailJS
      const templateParams = {
        from_name: "Neon Watchdog Security",
        to_email: email,
        passcode: resetOtp,
        time: new Date().toLocaleTimeString(),
        message: `PASSWORD RECOVERY: Your one-time identity verification code is ${resetOtp}. Enter this code to recover your admin access.`
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setIsResetSent(true);
        toast.success("Identity verification code dispatched!");
        setStage("otp"); // Reuse OTP stage for verification
      } else {
        throw new Error("Dispatch failed");
      }
      
      // Log reset request
      await logActivity("Password Recovery Initiated", `Email: ${email}`, "info");
      
    } catch (error: any) {
      console.error("Reset Error:", error);
      toast.error("Failed to initiate recovery protocol via EmailJS.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full h-10 rounded-lg bg-muted/50 border border-border px-3 text-sm mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";
  const labelClass = "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-red/5" />

      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        key={stage}
        className={`glass-panel p-8 w-full max-w-sm relative z-10 ${
          stage === "login" ? "neon-glow-cyan" : stage === "otp" ? "neon-glow-cyan" : "neon-glow-amber"
        }`}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${
            stage === "reset" ? "bg-neon-amber/10 border-neon-amber/30" : "bg-primary/10 border-primary/30"
          } border flex items-center justify-center`}>
            {stage === "reset" ? <Lock className="w-8 h-8 text-neon-amber" /> : <Shield className="w-8 h-8 text-primary" />}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground tracking-wide">{SYSTEM_CONFIG.PROJECT_NAME}</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
              {stage === "login" ? "Secure Gateway Portal" : stage === "otp" ? "Two-Step Verification" : "Administrative Recovery"}
            </p>
          </div>
        </div>

        {stage === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelClass}>Admin ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Admin Email"
                className={inputClass}
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass}>Access Key</label>
                <button
                  type="button"
                  onClick={() => setStage("reset")}
                  className="text-[10px] text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Access Key"
                  className={inputClass + " pr-10"}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? "Authenticating..." : "Authenticate"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Enter the 6-digit verification code sent to <strong>{email}</strong>
              </p>
            </div>
            <div>
              <label className={labelClass + " text-center"}>Security Code (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="0 0 0 0 0 0"
                maxLength={6}
                className={inputClass + " text-center text-lg tracking-[0.5em] font-bold h-12"}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
            <button
              type="button"
              onClick={() => setStage("login")}
              className="w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Back to Login
            </button>
          </form>
        )}

        {stage === "reset" && (
          <div className="space-y-4 text-center">
            {isResetSent ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-sm text-foreground mb-4">
                  Recovery instructions encoded and dispatched to your registered relay.
                </div>
                <button
                  onClick={() => { setStage("login"); setIsResetSent(false); }}
                  className="w-full h-10 rounded-lg bg-muted border border-border text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4 text-left">
                <div>
                  <label className={labelClass}>Registered ID / Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email for recovery"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-neon-amber text-black font-bold text-sm hover:opacity-90 transition-opacity uppercase tracking-widest mt-2 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Initiate Reset"}
                </button>
                <button
                  type="button"
                  onClick={() => setStage("login")}
                  className="w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mt-2"
                >
                  Cancel and Return
                </button>
              </form>
            )}
          </div>
        )}

        <div className={`mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground mono-text`}>
          <span className={`pulse-dot ${stage === "reset" ? "pulse-dot-amber" : "pulse-dot-cyan"}`} />
          {stage === "reset" ? "Recovery Protocols Online" : "Encrypted Connection Active"}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
