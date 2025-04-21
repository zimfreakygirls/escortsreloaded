
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";

interface DashboardHeaderProps {
  onLogout: () => Promise<void>;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error("Dashboard logout error:", error);
    }
  };

  return (
    <AnimationWrapper animation="fade" duration={0.7}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your website content and settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </AnimationWrapper>
  );
}
