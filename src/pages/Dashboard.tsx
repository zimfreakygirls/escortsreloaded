
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  country: string;
  price_per_hour: number;
  phone?: string;
  video_url?: string;
  images: string[];
}

interface Settings {
  id: string;
  profiles_per_page: number;
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<Settings>({
    id: 'global_settings',
    profiles_per_page: 6
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      console.log('Fetched profiles:', data);
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global_settings')
        .single();

      if (error) {
        // If settings don't exist yet, we'll create them with default values
        if (error.code === 'PGRST116') {
          return;
        }
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
      // Continue with default values
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(settings, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchSettings();
  }, []);

  const handleProfilesPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings(prev => ({ ...prev, profiles_per_page: value }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure global settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="profiles_per_page" className="block text-sm font-medium text-gray-300 mb-1">
                      Profiles per page
                    </label>
                    <Input
                      id="profiles_per_page"
                      type="number"
                      min="1"
                      value={settings.profiles_per_page}
                      onChange={handleProfilesPerPageChange}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Number of profiles to show before the "Load More" button
                    </p>
                  </div>
                </div>
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Countries</CardTitle>
              <CardDescription>
                Add or remove countries from the navigation menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CountryManager />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Profile</CardTitle>
              <CardDescription>
                Fill in the details below to create a new profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm onSuccess={fetchProfiles} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Profiles</CardTitle>
              <CardDescription>
                View and manage all profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilesTable profiles={profiles} onDelete={fetchProfiles} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
