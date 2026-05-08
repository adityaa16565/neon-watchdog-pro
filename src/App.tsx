import { useState, useCallback, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SplashScreen from "@/components/SplashScreen";
import Dashboard from "./pages/Dashboard";
import BehavioralAnalytics from "./pages/BehavioralAnalytics";
import ThreatAlerts from "./pages/ThreatAlerts";
import EmployeeActivity from "./pages/EmployeeActivity";
import UserManagement from "./pages/UserManagement";
import SecurityPolicies from "./pages/SecurityPolicies";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPassword from "./pages/ResetPassword";
import AuditLogs from "./pages/AuditLogs";
import SOARAutomation from "./pages/SOARAutomation";
import NotFound from "./pages/NotFound";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

const AppLayout = ({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full relative">
      {/* Global shield background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 shield-bg" />
      </div>
      <AppSidebar onLogout={onLogout} />
      {children}
    </div>
  </SidebarProvider>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem("neon_entered") !== "true";
  });
  const [showLanding, setShowLanding] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem("neon_entered") === "true";
  });

  useEffect(() => {
    // Listen for auth changes to handle manual login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // We don't automatically hide landing here anymore
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const handleSplashComplete = useCallback(() => { setShowSplash(false); setShowLanding(true); }, []);
  const handleGetStarted = useCallback(() => { setShowLanding(false); setShowRegister(true); }, []);
  const handleAdminLogin = useCallback(() => { setShowLanding(false); setShowRegister(false); setHasEntered(false); }, []);
  const handleLogin = useCallback(() => { 
    setIsAuthenticated(true); 
    setHasEntered(true); 
    sessionStorage.setItem("neon_entered", "true");
  }, []);
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setHasEntered(false);
    sessionStorage.removeItem("neon_entered");
    setShowLanding(true);
    // Properly clear any potential session data
    localStorage.clear();
    sessionStorage.clear();
  }, []);
  const handleRegisterComplete = useCallback(() => { setShowRegister(false); setHasEntered(false); }, []);

  // Determine main view based on auth state
  const MainContent = () => {
    if (showLanding) return <LandingPage onGetStarted={handleGetStarted} onAdminLogin={handleAdminLogin} />;
    if (showRegister) return <RegisterPage onRegister={handleRegisterComplete} onBack={() => { setShowRegister(false); setShowLanding(true); }} />;
    if (!isAuthenticated || !hasEntered) return <LoginPage onLogin={handleLogin} onBack={() => setShowLanding(true)} />;
    
    return (
      <Routes>
        <Route path="/" element={<AppLayout onLogout={handleLogout}><Dashboard /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout onLogout={handleLogout}><BehavioralAnalytics /></AppLayout>} />
        <Route path="/alerts" element={<AppLayout onLogout={handleLogout}><ThreatAlerts /></AppLayout>} />
        <Route path="/activity" element={<AppLayout onLogout={handleLogout}><EmployeeActivity /></AppLayout>} />
        <Route path="/users" element={<AppLayout onLogout={handleLogout}><UserManagement /></AppLayout>} />
        <Route path="/policies" element={<AppLayout onLogout={handleLogout}><SecurityPolicies /></AppLayout>} />
        <Route path="/audit" element={<AppLayout onLogout={handleLogout}><AuditLogs /></AppLayout>} />
        <Route path="/automation" element={<AppLayout onLogout={handleLogout}><SOARAutomation /></AppLayout>} />
        <Route path="/settings" element={<AppLayout onLogout={handleLogout}><SettingsPage /></AppLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {showSplash ? (
              <SplashScreen onComplete={handleSplashComplete} />
            ) : (
              <Routes>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/*" element={<MainContent />} />
              </Routes>
            )}
          </TooltipProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};


export default App;
