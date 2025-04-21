
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  children: ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className="dashboard-content max-w-screen-2xl mx-auto">
      <TabsList className="tabs-list flex overflow-x-auto md:flex-wrap space-x-1 mb-8 pb-1 h-auto border-b border-gray-800">
        <TabsTrigger 
          value="dashboard" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Dashboard
        </TabsTrigger>
        <TabsTrigger 
          value="profiles" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Profiles
        </TabsTrigger>
        <TabsTrigger 
          value="users" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Users
        </TabsTrigger>
        <TabsTrigger 
          value="payments" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Payment Verifications
        </TabsTrigger>
        <TabsTrigger 
          value="countries" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Countries
        </TabsTrigger>
        <TabsTrigger 
          value="videos" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Videos
        </TabsTrigger>
        <TabsTrigger 
          value="contacts" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Contacts
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Settings
        </TabsTrigger>
        <TabsTrigger 
          value="admin" 
          className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-4 py-2 rounded-md"
        >
          Admin
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
}
