
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Globe, Video, Settings, MessageSquare, UserCog, BarChart, UserX } from "lucide-react";

interface DashboardTabProps {
  children: ReactNode;
}

export function DashboardTabs({ children }: DashboardTabProps) {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6 dashboard-content">
      <TabsList className="bg-[#1e1c2e] border border-[#9b87f5]/20 p-1 gap-1">
        <TabsTrigger value="dashboard" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <BarChart className="h-4 w-4 mr-2" />
          <span>Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="profiles" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <Users className="h-4 w-4 mr-2" />
          <span>Profiles</span>
        </TabsTrigger>
        <TabsTrigger value="users" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <UserX className="h-4 w-4 mr-2" />
          <span>Users</span>
        </TabsTrigger>
        <TabsTrigger value="countries" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <Globe className="h-4 w-4 mr-2" />
          <span>Countries</span>
        </TabsTrigger>
        <TabsTrigger value="videos" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <Video className="h-4 w-4 mr-2" />
          <span>Videos</span>
        </TabsTrigger>
        <TabsTrigger value="contacts" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Contacts</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </TabsTrigger>
        <TabsTrigger value="admin" className="tabs-trigger data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
          <UserCog className="h-4 w-4 mr-2" />
          <span>Admin</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
