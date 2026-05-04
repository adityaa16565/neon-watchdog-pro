import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SOARPanel } from "@/components/SOARPanel";
import { StatsBar } from "@/components/widgets/StatsBar";
import { IsolationForestWidget } from "@/components/widgets/IsolationForestWidget";
import { RandomForestWidget } from "@/components/widgets/RandomForestWidget";
import { TimeSeriesWidget } from "@/components/widgets/TimeSeriesWidget";
import { SVMWidget } from "@/components/widgets/SVMWidget";
import { KMeansWidget } from "@/components/widgets/KMeansWidget";
import { SequentialPatternWidget } from "@/components/widgets/SequentialPatternWidget";
import { Menu, Radio, Zap } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const handleSimulateBreach = () => {
    toast.error("CRITICAL: SVM detected mass data exfiltration!", {
      description: "Triggering SOAR Playbook PB-001: Isolated Network.",
      duration: 5000,
    });
    
    setTimeout(() => {
      toast.success("DEFENSE ACTIVE: Target User_042 has been isolated.", {
        icon: <Zap className="w-4 h-4" />,
      });
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger>
            <Menu className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </SidebarTrigger>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSimulateBreach}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-neon-red/10 border border-neon-red/30 text-[10px] font-bold text-neon-red hover:bg-neon-red/20 transition-all uppercase tracking-tighter"
          >
            <Radio className="w-3 h-3 animate-pulse" /> Simulate Breach
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto grid-bg">
        <StatsBar />
        <SOARPanel />
        <div className="grid grid-cols-2 gap-4">
          <IsolationForestWidget />
          <RandomForestWidget />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TimeSeriesWidget />
          <SVMWidget />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <KMeansWidget />
          <SequentialPatternWidget />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
