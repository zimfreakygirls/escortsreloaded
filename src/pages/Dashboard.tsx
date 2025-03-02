
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CountryManager } from "@/components/CountryManager";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { ProfilesTable } from "@/components/dashboard/ProfilesTable";
import { BadgeCheck, Settings } from "lucide-react";
import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { fetchSettings, getCurrencySymbol } from "@/services/settings";
import { fetchProfiles, type Profile } from "@/services/profiles";
import type { Settings as SettingsType } from "@/services/settings";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    id: 'global_settings',
    profiles_per_page: 6,
    currency: 'USD'
  });

  const loadData = async () => {
    try {
      const profilesData = await fetchProfiles();
      setProfiles(profilesData);
      
      const settingsData = await fetchSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a]">
      <Header />
      
      <main className="container px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Settings className="mr-2 h-7 w-7 text-[#9b87f5]" />
              Admin Dashboard
            </h1>
          </div>

          <SettingsManager 
            settings={settings} 
            onSettingsChange={setSettings} 
          />

          <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
            <CardHeader className="border-b border-gray-800 pb-6">
              <CardTitle className="text-xl font-medium">Manage Countries</CardTitle>
              <CardDescription className="text-gray-400">
                Add or remove countries from the navigation menu
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CountryManager />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
            <CardHeader className="border-b border-gray-800 pb-6">
              <CardTitle className="text-xl font-medium flex items-center">
                <BadgeCheck className="w-5 h-5 text-[#9b87f5] mr-2" />
                Add New Profile
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details below to create a new profile
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileForm onSuccess={loadData} />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
            <CardHeader className="border-b border-gray-800 pb-6">
              <CardTitle className="text-xl font-medium">Manage Profiles</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage all profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfilesTable 
                profiles={profiles} 
                onDelete={loadData} 
                currencySymbol={getCurrencySymbol(settings.currency)}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
