
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

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
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

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-24">
        <div className="max-w-6xl mx-auto space-y-8">
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
