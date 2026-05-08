import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Menu, Save, ShieldCheck, Bell, Database, Key, Monitor, Activity, User, Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase, logActivity } from "@/lib/supabase";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState([15]);
  const [riskThreshold, setRiskThreshold] = useState([85]);

  // Profile State
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "",
    org_name: "",
    dept: "",
    designation: "",
    phone: "",
    employee_id: ""
  });

  // Security State
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: ""
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', user.id);

      if (data && data.length > 0) {
        const profileData = data[0];
        setProfile({
          name: profileData.name || "Admin User",
          email: profileData.email || user.email || "",
          org_name: profileData.org_name || "",
          dept: profileData.dept || "",
          designation: profileData.designation || "",
          phone: profileData.phone || "",
          employee_id: profileData.employee_id || ""
        });
      } else {
        // If no profile exists, set the email from auth at least
        setProfile(p => ({ ...p, email: user.email || "" }));
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No active session");

      // 1. Upsert Profile in Database (Create if missing, update if exists)
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: profile.name,
          org_name: profile.org_name,
          dept: profile.dept,
          designation: profile.designation,
          phone: profile.phone,
          employee_id: profile.employee_id,
          role: 'Admin',
          status: 'Active'
        });



      if (profileError) throw profileError;

      // 2. Update Password if provided
      if (passwords.new) {
        if (passwords.new !== passwords.confirm) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }
        if (passwords.new.length < 8) {
          toast.error("Password must be at least 8 characters");
          setIsLoading(false);
          return;
        }

        const { error: authError } = await supabase.auth.updateUser({
          password: passwords.new
        });

        if (authError) throw authError;
        
        setPasswords({ new: "", confirm: "" });
        toast.success("Security key updated successfully");
        await logActivity("Security Update", "Admin updated their access key", "success");
      }

      toast.success("Profile settings synchronized successfully");
      await logActivity("Profile Update", `Admin updated profile details for ${profile.email}`, "info");
    } catch (error: any) {
      toast.error(error.message || "Failed to sync settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-red/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="h-14 flex items-center justify-between border-b border-border/50 px-6 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger><Menu className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /></SidebarTrigger>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-sm font-semibold tracking-wide uppercase mono-text">Platform Configuration</h1>
        </div>
        <Button onClick={handleSave} disabled={isLoading} size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]">
          <Save className="w-4 h-4" />
          {isLoading ? "Synchronizing..." : "Save Changes"}
        </Button>
      </header>

      <main className="flex-1 p-6 overflow-y-auto z-10 grid-bg">
        <div className="max-w-4xl mx-auto mt-4">
          <Tabs defaultValue="general" className="w-full space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-muted/50 border border-border/50 p-1 rounded-xl">
              <TabsTrigger value="general" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><User className="w-4 h-4"/> Profile</TabsTrigger>
              <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Lock className="w-4 h-4"/> Security</TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Key className="w-4 h-4"/> API & Auth</TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Database className="w-4 h-4"/> Advanced</TabsTrigger>
            </TabsList>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* General Tab */}
              <TabsContent value="general" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-neon-cyan"/> Profile Information</CardTitle>
                    <CardDescription>Update your personal identity and organization details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Full Name</Label>
                        <Input 
                          value={profile.name} 
                          onChange={e => setProfile(p => ({...p, name: e.target.value}))}
                          className="bg-background/50 border-border/50 focus:border-neon-cyan/50 mono-text h-10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Email Address (Read-only)</Label>
                        <Input 
                          value={profile.email} 
                          disabled
                          className="bg-muted/50 border-border/50 text-muted-foreground mono-text h-10 cursor-not-allowed" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Phone Number</Label>
                        <Input 
                          value={profile.phone} 
                          onChange={e => setProfile(p => ({...p, phone: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Employee ID</Label>
                        <Input 
                          value={profile.employee_id} 
                          onChange={e => setProfile(p => ({...p, employee_id: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Organization</Label>
                        <Input 
                          value={profile.org_name} 
                          onChange={e => setProfile(p => ({...p, org_name: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Department</Label>
                        <Input 
                          value={profile.dept} 
                          onChange={e => setProfile(p => ({...p, dept: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Designation</Label>
                        <Input 
                          value={profile.designation} 
                          onChange={e => setProfile(p => ({...p, designation: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Bell className="w-5 h-5 text-neon-amber"/> System Notifications</CardTitle>
                    <CardDescription>Manage how you receive real-time threat intelligence.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Email Alerts</Label>
                        <p className="text-xs text-muted-foreground">Receive daily digest and critical alerts via email.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Desktop Notifications</Label>
                        <p className="text-xs text-muted-foreground">Show immediate browser alerts for high-risk flags.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-neon-green"/> Access Management</CardTitle>
                    <CardDescription>Update your secure access key and authentication policies.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">New Access Key</Label>
                        <div className="relative">
                          <Input 
                            type={showPass ? "text" : "password"}
                            value={passwords.new}
                            onChange={e => setPasswords(p => ({...p, new: e.target.value}))}
                            placeholder="Min. 8 characters"
                            className="bg-background/50 border-border/50 h-10 pr-10 mono-text" 
                          />
                          <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Confirm Access Key</Label>
                        <Input 
                          type="password"
                          value={passwords.confirm}
                          onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))}
                          className="bg-background/50 border-border/50 h-10 mono-text" 
                        />
                      </div>
                    </div>

                    <div className="h-px bg-border/50 my-2" />

                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Multi-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Require Email OTP for every administrative login.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-sm font-medium">Idle Session Timeout</Label>
                          <p className="text-xs text-muted-foreground">Auto-logout period for inactivity.</p>
                        </div>
                        <span className="text-sm font-mono text-neon-cyan px-2 py-1 rounded bg-neon-cyan/10 border border-neon-cyan/20">{sessionTimeout[0]} min</span>
                      </div>
                      <Slider value={sessionTimeout} onValueChange={setSessionTimeout} max={60} min={5} step={5} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Key className="w-5 h-5 text-primary"/> API & Infrastructure</CardTitle>
                    <CardDescription>Manage keys and endpoints for system integrations.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">EmailJS Service Key</Label>
                      <Input defaultValue={import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "********"} disabled className="mono-text text-sm bg-muted/30 border-border/50" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">ML Pipeline Node</Label>
                      <Input defaultValue="https://sentinel-ai.internal/v1" className="mono-text text-sm bg-background/50 border-border/50 h-10" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-neon-red"/> Behavioral Analysis Config</CardTitle>
                    <CardDescription>Adjust sensitivity for automated threat detection.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-sm font-medium">Critical Risk Auto-Lock</Label>
                          <p className="text-xs text-muted-foreground mt-1">Automatic account locking threshold.</p>
                        </div>
                        <span className="text-sm font-mono text-neon-red px-2 py-1 rounded bg-neon-red/10 border border-neon-red/20">{riskThreshold[0]}</span>
                      </div>
                      <Slider value={riskThreshold} onValueChange={setRiskThreshold} max={100} min={50} step={1} className="[&_[role=slider]]:border-neon-red" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
