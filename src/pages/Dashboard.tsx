
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { BadgeCheck, Settings, Phone, Video, Loader2 } from "lucide-react";
import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { ContactManager } from "@/components/dashboard/ContactManager";
import { VideoUploader } from "@/components/dashboard/VideoUploader";
import { fetchSettings, getCurrencySymbol } from "@/services/settings";
import { fetchProfiles, type Profile } from "@/services/profiles";
import type { Settings as SettingsType } from "@/services/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/utils/adminUtils";

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    id: 'global_settings',
    profiles_per_page: 6,
    currency: 'USD'
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate("/admin-login");
        return;
      }
      
      const adminStatus = await checkIsAdmin(data.session.user.id);
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        navigate("/");
        return;
      }
      
      loadData();
      setLoading(false);
    };
    
    checkAccess();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This shouldn't render because navigate should redirect
  }

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

          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="mb-6 bg-[#292741] border-b border-gray-800">
              <TabsTrigger value="settings">General Settings</TabsTrigger>
              <TabsTrigger value="countries">Countries</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-6">
              <SettingsManager 
                settings={settings} 
                onSettingsChange={setSettings} 
              />
            </TabsContent>
            
            <TabsContent value="countries" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="profiles" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <VideoUploader />
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-6">
              <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
                <CardHeader className="border-b border-gray-800 pb-6">
                  <CardTitle className="text-xl font-medium flex items-center">
                    <Phone className="w-5 h-5 text-[#9b87f5] mr-2" />
                    Contact Page Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update the contact details and disclaimer displayed on the contact page
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ContactManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
