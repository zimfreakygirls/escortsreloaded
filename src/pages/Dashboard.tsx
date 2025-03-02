
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
import { Loader2, DollarSign, Settings, BadgeCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  is_verified?: boolean;
  is_premium?: boolean;
}

interface Settings {
  id: string;
  profiles_per_page: number;
  currency: string;
  created_at?: string;
}

const currencies = [
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
  { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
  { value: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
  { value: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { value: "CHF", label: "Swiss Franc (CHF)", symbol: "CHF" },
  { value: "ZMW", label: "Zambian Kwacha (K)", symbol: "K" },
];

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [settings, setSettings] = useState<Settings>({
    id: 'global_settings',
    profiles_per_page: 6,
    currency: 'USD'
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
        const settingsData = data as Settings;
        // Set default currency if not present
        if (!settingsData.currency) {
          settingsData.currency = 'USD';
        }
        setSettings(settingsData);
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

  const handleCurrencyChange = (value: string) => {
    setSettings(prev => ({ ...prev, currency: value }));
  };

  const getCurrencySymbol = () => {
    const found = currencies.find(c => c.value === settings.currency);
    return found ? found.symbol : '$';
  };

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

          <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
            <CardHeader className="border-b border-gray-800 pb-6">
              <CardTitle className="text-xl font-medium flex items-center">
                <DollarSign className="w-5 h-5 text-[#9b87f5] mr-2" />
                General Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure global settings for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="profiles_per_page" className="block text-sm font-medium text-gray-300">
                      Profiles per page
                    </label>
                    <Input
                      id="profiles_per_page"
                      type="number"
                      min="1"
                      value={settings.profiles_per_page}
                      onChange={handleProfilesPerPageChange}
                      className="w-full bg-[#1e1c2e] border-gray-700 focus:border-[#9b87f5] focus:ring-1 focus:ring-[#7E69AB]"
                    />
                    <p className="text-xs text-gray-400">
                      Number of profiles to show before the "Load More" button
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
                      Currency
                    </label>
                    <Select 
                      value={settings.currency} 
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger 
                        id="currency" 
                        className="w-full bg-[#1e1c2e] border-gray-700 focus:border-[#9b87f5] focus:ring-1 focus:ring-[#7E69AB]"
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#292741] border-gray-700 text-white">
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-400">
                      Select the currency to display throughout the site
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={saveSettings} 
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:from-[#8b77e5] hover:to-[#5E49A5] border-0 text-white"
                >
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
              <ProfileForm onSuccess={fetchProfiles} />
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
                onDelete={fetchProfiles} 
                currencySymbol={getCurrencySymbol()}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
