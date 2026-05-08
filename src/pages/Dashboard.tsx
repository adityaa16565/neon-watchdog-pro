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
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="h-12 flex items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger>
            <Menu className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </SidebarTrigger>
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
