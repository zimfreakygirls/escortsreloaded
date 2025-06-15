
import { TabsContent } from "@/components/ui/tabs";
import { CountryManager } from "@/components/CountryManager";
import { VideoUploader } from "@/components/dashboard/VideoUploader";
import { ContactManager } from "@/components/dashboard/ContactManager";
import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { AdminSettings } from "@/components/dashboard/AdminSettings";
import { AdminSignupSettings } from "@/components/dashboard/AdminSignupSettings";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SiteStatusManager } from "@/components/dashboard/SiteStatusManager";

interface SettingsTabContentProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export function DashboardTabContent() {
  return (
    <TabsContent value="dashboard" className="space-y-4">
      <DashboardStats />
    </TabsContent>
  );
}

export function CountriesTabContent() {
  return (
    <TabsContent value="countries" className="space-y-4">
      <CountryManager />
    </TabsContent>
  );
}

export function VideosTabContent() {
  return (
    <TabsContent value="videos" className="space-y-4">
      <VideoUploader />
    </TabsContent>
  );
}

export function ContactsTabContent() {
  return (
    <TabsContent value="contacts" className="space-y-4">
      <ContactManager />
    </TabsContent>
  );
}

export function SettingsTabContent({ settings, onSettingsChange }: SettingsTabContentProps) {
  return (
    <TabsContent value="settings" className="space-y-4">
      <SettingsManager 
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </TabsContent>
  );
}

export function AdminTabContent() {
  return (
    <TabsContent value="admin" className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <AdminSettings />
      <AdminSignupSettings />
      <SiteStatusManager />
    </TabsContent>
  );
}
