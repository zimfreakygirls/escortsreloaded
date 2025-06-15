
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
        <div className="w-full overflow-hidden mb-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="tabs-list inline-flex w-max space-x-1 pb-1 h-auto border-b border-gray-800 px-2">
              <TabsTrigger 
                value="dashboard" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="profiles" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Profiles
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger 
                value="countries" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Countries
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Contacts
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="tabs-trigger bg-transparent data-[state=active]:bg-[#1e1c2e] data-[state=active]:text-white px-3 py-2 rounded-md text-sm whitespace-nowrap flex-shrink-0"
              >
                Admin
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>
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
