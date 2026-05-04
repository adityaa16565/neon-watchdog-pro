import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Menu, Save, ShieldCheck, Bell, Database, Key, Monitor, Activity, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SettingsPage = () => {
  const [sessionTimeout, setSessionTimeout] = useState([15]);
  const [riskThreshold, setRiskThreshold] = useState([85]);

  const handleSave = () => {
    toast.success("Settings updated successfully");
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
          <h1 className="text-sm font-semibold tracking-wide">Platform Settings</h1>
        </div>
        <Button onClick={handleSave} size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </header>

      <main className="flex-1 p-6 overflow-y-auto z-10 grid-bg">
        <div className="max-w-4xl mx-auto mt-4">
          <Tabs defaultValue="general" className="w-full space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-muted/50 border border-border/50 p-1 rounded-xl">
              <TabsTrigger value="general" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Monitor className="w-4 h-4"/> General</TabsTrigger>
              <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><ShieldCheck className="w-4 h-4"/> Security</TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Key className="w-4 h-4"/> API & Auth</TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"><Database className="w-4 h-4"/> Advanced</TabsTrigger>
            </TabsList>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* General Tab */}
              <TabsContent value="general" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-neon-cyan"/> Profile Information</CardTitle>
                    <CardDescription>Update your admin profile details and contact information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                        <Input id="name" defaultValue="Admin User" className="bg-background/50 border-border/50 focus:border-neon-cyan/50" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                        <Input id="email" defaultValue="admin@neonwatchdog.com" className="bg-background/50 border-border/50 focus:border-neon-cyan/50" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Bell className="w-5 h-5 text-neon-amber"/> Notifications</CardTitle>
                    <CardDescription>Configure how you receive system alerts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Email Alerts</Label>
                        <p className="text-xs text-muted-foreground">Receive daily digest and critical alerts via email.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">SMS Notifications</Label>
                        <p className="text-xs text-muted-foreground">Get immediate text messages for critical security events.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-neon-green"/> Authentication Policies</CardTitle>
                    <CardDescription>Manage global security policies for all platform users.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Enforce 2FA</Label>
                        <p className="text-xs text-muted-foreground">Require Two-Factor Authentication for all admin accounts.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Strict IP Binding</Label>
                        <p className="text-xs text-muted-foreground">Lock admin sessions to their initial IP address.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-sm font-medium">Idle Session Timeout</Label>
                          <p className="text-xs text-muted-foreground mt-1">Automatically log out users after a period of inactivity.</p>
                        </div>
                        <span className="text-sm font-mono text-neon-cyan px-2 py-1 rounded bg-neon-cyan/10 border border-neon-cyan/20">{sessionTimeout[0]} min</span>
                      </div>
                      <Slider 
                        value={sessionTimeout} 
                        onValueChange={setSessionTimeout} 
                        max={60} 
                        min={5}
                        step={5} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations Tab */}
              <TabsContent value="integrations" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Key className="w-5 h-5 text-primary"/> API Integrations</CardTitle>
                    <CardDescription>Configure external endpoints and keys for SIEM and ML modules.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ML Pipeline Endpoint</Label>
                      <Input defaultValue="https://ml.sentinel.internal/v3/predict" className="font-mono text-sm bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SIEM Integration Key</Label>
                      <Input type="password" defaultValue="sk_live_83hf832hf983" className="font-mono text-sm bg-background/50 border-border/50 h-10" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threat Intel Feed URL</Label>
                      <Input defaultValue="https://feeds.otx.alienvault.com/api/v1" className="font-mono text-sm bg-background/50 border-border/50 h-10" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 outline-none">
                <Card className="glass-panel border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Activity className="w-5 h-5 text-neon-red"/> Advanced Rules Engine</CardTitle>
                    <CardDescription>Configure low-level system thresholds and database parameters.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30 space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <Label className="text-sm font-medium">Critical Risk Auto-Lock Threshold</Label>
                          <p className="text-xs text-muted-foreground mt-1">Accounts exceeding this risk score will be automatically locked.</p>
                        </div>
                        <span className="text-sm font-mono text-neon-red px-2 py-1 rounded bg-neon-red/10 border border-neon-red/20">{riskThreshold[0]}</span>
                      </div>
                      <Slider 
                        value={riskThreshold} 
                        onValueChange={setRiskThreshold} 
                        max={100} 
                        min={50}
                        step={1} 
                        className="w-full [&_[role=slider]]:border-neon-red"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data Retention Period</Label>
                        <Input defaultValue="90 days" className="bg-background/50 border-border/50 h-10" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Log Granularity</Label>
                        <Input defaultValue="Millisecond" className="bg-background/50 border-border/50 h-10" />
                      </div>
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
