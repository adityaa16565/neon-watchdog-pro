import {
  LayoutDashboard,
  BrainCircuit,
  AlertTriangle,
  UserSearch,
  Users,
  ShieldCheck,
  Settings,
  Shield,
  LogOut,
  Activity,
  History,
  Workflow,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Behavioral Analytics", url: "/analytics", icon: BrainCircuit },
  { title: "Threat Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Employee Activity", url: "/activity", icon: UserSearch },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Audit Logs", url: "/audit", icon: History },
  { title: "SOAR Automation", url: "/automation", icon: Workflow },
  { title: "Settings", url: "/settings", icon: Settings },
];

import { useState, useEffect } from "react";

export function AppSidebar({ onLogout }: { onLogout?: () => void }) {
  const [systemStatus, setSystemStatus] = useState({
    ml: "Active",
    soar: "Armed",
    threat: "Elevated"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate status to simulate real-time monitoring
      const threatLevels = ["Low", "Stable", "Elevated", "Critical"];
      const mlStatus = ["Active", "Processing", "Training", "Active"];
      const soarStatus = ["Armed", "Standby", "Executing", "Armed"];
      
      setSystemStatus({
        ml: mlStatus[Math.floor(Math.random() * mlStatus.length)],
        soar: soarStatus[Math.floor(Math.random() * soarStatus.length)],
        threat: threatLevels[Math.floor(Math.random() * threatLevels.length)]
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center neon-glow-cyan">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-wide">Neon Watchdog Pro</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Threat Intelligence</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            {!collapsed && "Operations"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          active
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                        activeClassName=""
                      >
                        <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
                        {!collapsed && <span>{item.title}</span>}
                        {active && item.url === "/alerts" && !collapsed && (
                          <span className="ml-auto flex items-center gap-1.5">
                            <span className="pulse-dot pulse-dot-red" />
                            <span className="text-[10px] mono-text text-neon-red">12</span>
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              System Status
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">ML Pipeline</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`pulse-dot ${systemStatus.ml === "Active" ? "pulse-dot-cyan" : "pulse-dot-amber"}`} />
                    <span className={`${systemStatus.ml === "Active" ? "text-primary" : "text-neon-amber"} mono-text transition-colors duration-500`}>
                      {systemStatus.ml}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">SOAR Engine</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`pulse-dot ${systemStatus.soar === "Armed" ? "pulse-dot-cyan" : "pulse-dot-amber"}`} />
                    <span className={`${systemStatus.soar === "Armed" ? "text-primary" : "text-neon-amber"} mono-text transition-colors duration-500`}>
                      {systemStatus.soar}
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Threat Level</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`pulse-dot ${
                      systemStatus.threat === "Critical" ? "pulse-dot-red" : 
                      systemStatus.threat === "Elevated" ? "pulse-dot-amber" : "pulse-dot-cyan"
                    }`} />
                    <span className={`${
                      systemStatus.threat === "Critical" ? "text-neon-red" : 
                      systemStatus.threat === "Elevated" ? "text-neon-amber" : "text-primary"
                    } mono-text transition-colors duration-500`}>
                      {systemStatus.threat}
                    </span>
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        {!collapsed && (
          <div className="glass-panel p-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Admin Console</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-bold text-neon-red hover:bg-neon-red/10 transition-colors border border-neon-red/20"
            >
              <LogOut className="w-3 h-3" />
              Terminate Session
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
