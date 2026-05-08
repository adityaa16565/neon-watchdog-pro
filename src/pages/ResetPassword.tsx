import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { SYSTEM_CONFIG } from "@/lib/constants";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (Supabase sets it automatically from the URL hash)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired recovery link.");
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Access keys do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Access key must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Access key updated successfully!");
      setTimeout(() => navigate("/"), 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update access key");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full h-10 rounded-lg bg-muted/50 border border-border px-3 text-sm mono-text text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50";
  const labelClass = "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-red/5" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 w-full max-w-sm relative z-10 neon-glow-cyan"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground tracking-wide">{SYSTEM_CONFIG.PROJECT_NAME}</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">
              Reset Access Key
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-neon-green animate-pulse" />
            </div>
            <p className="text-sm text-foreground">Access key successfully updated.</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className={labelClass}>New Access Key</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={inputClass + " pr-10"}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm New Access Key</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter access key"
                className={inputClass}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Access Key"}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground mono-text">
          <span className="pulse-dot pulse-dot-cyan" />
          Security Protocol Active
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
