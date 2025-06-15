
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardTabsProps {
  children: ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="dashboard" className="dashboard-content max-w-screen-2xl mx-auto">
      {isMobile ? (
        <ScrollArea className="w-full">
          <TabsList className="tabs-list flex w-max space-x-1 mb-6 pb-1 h-auto border-b border-gray-800 px-4">
            <TabsTrigger 
              value="dashboard" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="profiles" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Profiles
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="countries" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Countries
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Contacts
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap"
            >
              Admin
            </TabsTrigger>
          </TabsList>
        </ScrollArea>
      ) : (
        <TabsList className="tabs-list flex flex-wrap gap-1 mb-8 pb-1 h-auto border-b border-gray-800">
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
      )}
      
      {children}
    </Tabs>
  );
}
