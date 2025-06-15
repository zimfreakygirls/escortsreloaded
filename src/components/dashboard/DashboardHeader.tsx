
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  onLogout: () => Promise<void>;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <AnimationWrapper animation="fade" duration={0.7}>
      <div className={`flex items-center justify-between mb-6 ${isMobile ? 'flex-col gap-4' : ''}`}>
        <div className={isMobile ? 'text-center' : ''}>
          <h1 className={`font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            Admin Dashboard
          </h1>
          <p className={`text-gray-400 mt-2 ${isMobile ? 'text-sm' : ''}`}>
            Manage your website content and settings
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onLogout}
          className={`flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/30 ${isMobile ? 'w-full justify-center' : ''}`}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </AnimationWrapper>
  );
}
