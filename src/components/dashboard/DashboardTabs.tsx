
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  children: React.ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <div className="overflow-x-auto">
        <TabsList className="flex w-max min-w-full bg-[#292741] border border-gray-800 p-1">
          <TabsTrigger value="dashboard" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profiles" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Profiles
          </TabsTrigger>
          <TabsTrigger value="users" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Users
          </TabsTrigger>
          <TabsTrigger value="payments" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Payments
          </TabsTrigger>
          <TabsTrigger value="countries" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Countries
          </TabsTrigger>
          <TabsTrigger value="videos" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Videos
          </TabsTrigger>
          <TabsTrigger value="contacts" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Contacts
          </TabsTrigger>
          <TabsTrigger value="settings" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Settings
          </TabsTrigger>
          <TabsTrigger value="admin" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Settings
          </TabsTrigger>
          <TabsTrigger value="admin-users" className="tabs-trigger text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
            Admins
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
