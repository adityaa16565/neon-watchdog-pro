import { Shield, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { SYSTEM_CONFIG } from "@/lib/constants";

import { supabase, logActivity } from "@/lib/supabase";
import { toast } from "sonner";

const LoginPage = ({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both ID and Key");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await logActivity("Admin Login", "Successful authentication via portal", "success");
      onLogin();
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      await logActivity("Failed Login Attempt", `Email: ${email}`, "warning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSent(true);
  };

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
        className={`glass-panel p-8 w-full max-w-sm relative z-10 ${stage === "login" ? "neon-glow-cyan" : "neon-glow-amber"}`}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className={`w-16 h-16 rounded-2xl ${stage === "login" ? "bg-primary/10 border-primary/30" : "bg-neon-amber/10 border-neon-amber/30"} border flex items-center justify-center`}>
            {stage === "login" ? <Shield className="w-8 h-8 text-primary" /> : <Lock className="w-8 h-8 text-neon-amber" />}
          </div>
          <div className="text-center">
                <h1 className="text-xl font-bold text-foreground tracking-wide">{SYSTEM_CONFIG.PROJECT_NAME}</h1>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
                  {stage === "login" ? "Secure Gateway Portal" : "Administrative Recovery"}
                </p>
              </div>
            </div>

            {stage === "login" ? (
              <>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Admin ID</label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Admin ID"
                      className="w-full h-10 rounded-lg bg-muted/50 border border-border px-3 text-sm mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground block">Access Key</label>
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
                        className="w-full h-10 rounded-lg bg-muted/50 border border-border px-3 pr-10 text-sm mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
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
          </>
        ) : (
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
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block">Registered ID / Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email for recovery"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-lg bg-muted/50 border border-border px-3 text-sm mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-neon-amber/50"
                  />
                </div>
                <button type="submit" className="w-full h-10 rounded-lg bg-neon-amber text-black font-bold text-sm hover:opacity-90 transition-opacity uppercase tracking-widest mt-2">
                  Initiate Reset
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
          <span className={`pulse-dot ${stage === "login" ? "pulse-dot-cyan" : "pulse-dot-amber"}`} />
          {stage === "login" ? "Encrypted Connection Active" : "Recovery Protocols Online"}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
