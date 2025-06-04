
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/profile-card/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Settings {
  id: string;
  profiles_per_page: number;
  created_at?: string;
}

export default function CountryProfiles() {
  const { country } = useParams();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState(4);
  const [viewMode, setViewMode] = useState("grid-2");
  const [displayLimit, setDisplayLimit] = useState(4);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (country) {
      setIsLoading(true);
      fetchProfiles();
      fetchSettings();
    }
  }, [country]);

  const fetchProfiles = async () => {
    try {
      const formattedCountry = country ? 
        country.charAt(0).toUpperCase() + country.slice(1).toLowerCase() : '';
      
      console.log("Fetching profiles for country:", formattedCountry);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('country', formattedCountry)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Found profiles:", data?.length || 0);
      setProfiles(data || []);
    } catch (error: any) {
      console.error("Error fetching profiles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        if (error.code === 'PGRST116') {
          return;
        }
        throw error;
      }

      if (data) {
        const settingsData = data as Settings;
        setVisibleProfiles(settingsData.profiles_per_page);
        setDisplayLimit(settingsData.profiles_per_page);
      }
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleProfiles(prev => Math.min(prev + displayLimit, profiles.length));
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "list":
        return "grid-cols-1 gap-6 max-w-3xl mx-auto";
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6";
      case "grid-1":
        return "grid-cols-1 max-w-md mx-auto gap-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container pt-24 pb-12 px-4">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold capitalize">{country} Profiles</h1>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => {
              if (value) {
                setViewMode(value);
              }
            }}
            className="bg-secondary rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="grid-1" 
              aria-label="Single Column"
              className="data-[state=on]:bg-primary data-[state=on]:text-white p-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="grid-2" 
              aria-label="Grid View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white p-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="list" 
              aria-label="List View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white p-2 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="4" y="10" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                <rect x="4" y="16" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : profiles.length > 0 ? (
          <div className={`grid ${getGridClass()}`}>
            {profiles.slice(0, visibleProfiles).map((profile) => (
              <Link key={profile.id} to={`/profile/${profile.id}`} className="block h-full">
                <ProfileCard 
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  imageUrl={profile.images[0] || '/placeholder.svg'}
                  viewMode={viewMode}
                  city={profile.city}
                  country={profile.country}
                  phone={profile.is_verified ? profile.phone : undefined}
                  isVerified={profile.is_verified}
                  isPremium={profile.is_premium}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No profiles found for {country}</p>
          </div>
        )}
        
        {profiles.length > 0 && visibleProfiles < profiles.length && (
          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              onClick={handleLoadMore}
              className="px-8 py-6 bg-gradient-to-r from-primary/90 to-purple-500 hover:from-primary hover:to-purple-600 transition-all duration-300 text-base shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
