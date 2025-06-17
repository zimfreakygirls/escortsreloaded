
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardTabsProps {
  children: React.ReactNode;
}

export function DashboardTabs({ children }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-8 lg:grid-cols-8 bg-[#292741] border border-gray-800">
        <TabsTrigger value="dashboard" className="tabs-trigger text-xs sm:text-sm">
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="profiles" className="tabs-trigger text-xs sm:text-sm">
          Profiles
        </TabsTrigger>
        <TabsTrigger value="users" className="tabs-trigger text-xs sm:text-sm">
          Users
        </TabsTrigger>
        <TabsTrigger value="payment-verifications" className="tabs-trigger text-xs sm:text-sm">
          Payments
        </TabsTrigger>
        <TabsTrigger value="countries" className="tabs-trigger text-xs sm:text-sm">
          Countries
        </TabsTrigger>
        <TabsTrigger value="videos" className="tabs-trigger text-xs sm:text-sm">
          Videos
        </TabsTrigger>
        <TabsTrigger value="contacts" className="tabs-trigger text-xs sm:text-sm">
          Contacts
        </TabsTrigger>
        <TabsTrigger value="settings" className="tabs-trigger text-xs sm:text-sm">
          Settings
        </TabsTrigger>
        <TabsTrigger value="admin" className="tabs-trigger text-xs sm:text-sm">
          Admin
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
