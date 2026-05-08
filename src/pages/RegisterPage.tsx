import { Shield, ArrowLeft, Eye, EyeOff, UserPlus, Upload } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { supabase, logActivity } from "@/lib/supabase";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const RegisterPage = ({ onRegister, onBack }: { onRegister: () => void; onBack: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dept, setDept] = useState("");
  const [designation, setDesignation] = useState("");
  const [orgName, setOrgName] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [clearance, setClearance] = useState("");
  const [role, setRole] = useState("Admin");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step validation
    if (step === 1) {
      if (phone.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
      if (!firstName || !lastName || !dob || !address || !city || !country) {
        toast.error("Please fill all personal information fields");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!employeeId || !dept || !designation || !orgName || !accessLevel || !clearance) {
        toast.error("Please fill all organization details");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setIsLoading(true);
      try {
        // Generate random 6-digit OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        // Send Email via EmailJS
        const templateParams = {
          from_name: "Neon Watchdog Pro",
          to_email: email,      // Ensure this matches your template field
          reply_to: email,
          passcode: newOtp,     // Matches your {{passcode}}
          time: new Date().toLocaleTimeString(), // Matches your {{time}}
          message: `Your verification code is ${newOtp}`
        };

        const response = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
          toast.success("Verification code sent to your email!");
          setStep(4);
        } else {
          throw new Error("Failed to send email");
        }
      } catch (error: any) {
        console.error("EmailJS Error:", error);
        const errorMsg = error?.text || error?.message || "Check your EmailJS keys & Service status";
        toast.error(`EmailJS Error: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 4) {
      if (otp !== generatedOtp) {
        toast.error("Invalid verification code");
        return;
      }

      setIsLoading(true);
      try {
        // Debug check for Env Variables
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error("Vercel Environment Variables are missing! Please check Vercel Dashboard.");
        }

        console.log("Starting Registration for:", email);

        // Step 1: Create Auth user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName }
          }
        });

        // If user already exists, Supabase might throw an error or return an existing user depending on settings
        if (signUpError) {
          console.error("Auth Error:", signUpError);
          // If the error is about existing user, we try to create profile anyway
          if (!signUpError.message.includes("already registered")) {
            throw signUpError;
          }
        }

        const authUser = signUpData.user || (await supabase.auth.getUser()).data.user;
        
        if (!authUser) {
          throw new Error("Identity verification failed in Supabase. Check if email is confirmed.");
        }

        console.log("User Auth Verified (ID: " + authUser.id + "). Syncing Profile...");

        // Step 2: Create/Update profile in admin_profiles
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .upsert([{
            id: authUser.id,
            name: `${firstName} ${lastName}`,
            email,
            phone,
            employee_id: employeeId,
            dept,
            designation,
            org_name: orgName,
            role: 'Admin',
            status: 'Active'
          }]);

        if (profileError) {
          console.error("Profile Sync Error:", profileError);
          toast.warning("Auth account ready, but profile data sync was blocked by database.");
        } else {
          toast.success("Security Clearance Granted. Welcome to the Network.");
          await logActivity("New Admin Onboarded", `Admin ${email} registered successfully`, "success");
        }

        // Finalize
        onRegister();
      } catch (error: any) {
        console.error("System-wide Registration Failure:", error);
        toast.error(error.message || "Registration protocol failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const inputClass =
    "w-full h-10 rounded-lg bg-muted/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground";
  const labelClass = "text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 block";

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg relative py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

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
        className="glass-panel p-8 w-full max-w-lg relative z-10 neon-glow-cyan"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground tracking-wide">Admin Registration</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Neon Watchdog Pro Portal</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 border border-border text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div className={`w-6 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-5">
          <p className="text-xs text-muted-foreground">
            {step === 1 && "Personal Information"}
            {step === 2 && "Organization Details"}
            {step === 3 && "Security Credentials"}
            {step === 4 && "Verification Required"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Avatar */}
              <div className="flex justify-center">
                <label className="cursor-pointer group">
                  <div className="w-20 h-20 rounded-full bg-muted/50 border-2 border-dashed border-border group-hover:border-primary/50 flex items-center justify-center overflow-hidden transition-colors">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <p className="text-[9px] text-muted-foreground text-center mt-1">Upload Photo</p>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" placeholder="John" className={inputClass} required value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" placeholder="Doe" className={inputClass} required value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" className={inputClass} required value={dob} onChange={e => setDob(e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="10-digit Mobile Number" 
                  className={inputClass} 
                  required 
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val);
                  }} 
                />
                <p className="text-[9px] text-muted-foreground mt-1">Example: 9876543210</p>
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <input type="text" placeholder="123 Security Blvd" className={inputClass} required value={address} onChange={e => setAddress(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" placeholder="New York" className={inputClass} required value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <select className={inputClass} required value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">Select</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Germany</option>
                    <option>India</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Employee ID</label>
                <input type="text" placeholder="NW-2026-0001" className={inputClass + " font-mono"} required value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Department</label>
                <select className={inputClass} required value={dept} onChange={e => setDept(e.target.value)}>
                  <option value="">Select Department</option>
                  <option>Cybersecurity</option>
                  <option>IT Operations</option>
                  <option>Risk Management</option>
                  <option>Compliance</option>
                  <option>Executive Leadership</option>
                  <option>Network Security</option>
                  <option>Incident Response</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Designation</label>
                <select className={inputClass} required value={designation} onChange={e => setDesignation(e.target.value)}>
                  <option value="">Select Designation</option>
                  <option>Chief Security Officer (CSO)</option>
                  <option>Security Director</option>
                  <option>Security Analyst</option>
                  <option>SOC Manager</option>
                  <option>Incident Response Lead</option>
                  <option>Threat Intelligence Analyst</option>
                  <option>Security Administrator</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Organization Name</label>
                <input type="text" placeholder="Sentinel Corp" className={inputClass} required value={orgName} onChange={e => setOrgName(e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Admin Access Level</label>
                <select className={inputClass} required value={accessLevel} onChange={e => setAccessLevel(e.target.value)}>
                  <option value="">Select Access Level</option>
                  <option>Super Admin — Full system access</option>
                  <option>Security Admin — Security configurations</option>
                  <option>Analyst — Read & investigate</option>
                  <option>Auditor — Read-only compliance</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Security Clearance</label>
                <select className={inputClass} required value={clearance} onChange={e => setClearance(e.target.value)}>
                  <option value="">Select Clearance</option>
                  <option>Level 5 — Top Secret</option>
                  <option>Level 4 — Secret</option>
                  <option>Level 3 — Confidential</option>
                  <option>Level 2 — Restricted</option>
                  <option>Level 1 — Unclassified</option>
                </select>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Official Email</label>
                <input type="email" placeholder="admin@neon-watchdog.sec" className={inputClass} required value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <label className={labelClass}>Create Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    className={inputClass + " pr-10"}
                    required
                    minLength={8}
                    maxLength={12}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Must include uppercase, lowercase, number & symbol</p>
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className={inputClass + " pr-10"}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Two-Factor Authentication</label>
                <select className={inputClass} required>
                  <option value="email">Email Verification (OTP)</option>
                </select>
              </div>


              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" required className="mt-1 accent-primary" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  I agree to the Neon Watchdog Pro Admin Terms of Service, Data Protection Policy,
                  and acknowledge the responsibility of admin-level access to insider risk data.
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Verify Your Identity</h3>
                <p className="text-[11px] text-muted-foreground px-4">
                  We've sent a 6-digit verification code to <strong>{email}</strong> for secure registration.
                </p>
              </div>

              <div>
                <label className={labelClass + " text-center"}>Verification Code (OTP)</label>
                <input 
                  type="text" 
                  placeholder="0 0 0 0 0 0" 
                  className={inputClass + " text-center text-lg tracking-[0.5em] font-bold h-12"} 
                  required 
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <div className="text-center">
                <button 
                  type="button"
                  className="text-[10px] text-primary hover:underline uppercase tracking-wider font-bold"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const templateParams = {
                        to_email: email,
                        to_name: `${firstName} ${lastName}`,
                        passcode: generatedOtp,
                      };

                      await emailjs.send(
                        import.meta.env.VITE_EMAILJS_SERVICE_ID,
                        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                        templateParams,
                        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                      );
                      toast.success("Verification code resent to your email!");
                    } catch (e) {
                      toast.error("Failed to resend code.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Resend Code
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-10 rounded-lg border border-border font-semibold text-sm hover:bg-muted/50 transition-colors"
              >
                Back
              </button>
            )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {step < 3 ? (
                  "Continue"
                ) : step === 3 ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    {isLoading ? "Registering..." : "Register Admin"}
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    {isLoading ? "Verifying..." : "Verify & Complete"}
                  </>
                )}
              </button>
          </div>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span className="pulse-dot pulse-dot-cyan" />
          Encrypted Connection Active
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
