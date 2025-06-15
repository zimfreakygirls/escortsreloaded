import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/profile-card/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Settings {
  id: string;
  profiles_per_page: number;
  created_at?: string;
}

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  country: string;
  price_per_hour: number;
  phone?: string;
  images: string[];
  is_verified?: boolean;
  is_premium?: boolean;
  is_video?: boolean;
}

export default function Index() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState(6);
  const [viewMode, setViewMode] = useState("grid-2");
  const [displayLimit, setDisplayLimit] = useState(6);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Load profiles regardless of authentication status
    loadProfiles();

    // Clean up
    return () => {
      subscription.unsubscribe();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all profiles with currency information
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      // Filter for real, admin-added non-video profiles:
      // - Must have at least one image (image[0] is not /placeholder.svg/)
      // - Optionally: require is_verified true (uncomment if desired).
      // - Exclude default/empty profiles with no image and no price
      const nonVideoProfiles = (profilesData || []).filter(profile => {
        // A "real" profile must have at least one image URL that is not the placeholder and that is not empty
        const hasRealImage =
          Array.isArray(profile.images) &&
          profile.images.length > 0 &&
          profile.images[0] &&
          !profile.images[0].includes("placeholder.svg");

        // Optionally filter for verified only (uncomment next line if you want!)
        // const isActuallyVerified = !!profile.is_verified;

        // Potential criteria: Must have image, non-default name, phone present, admin sets is_verified
        const isAdminAdded =
          hasRealImage &&
          typeof profile.name === "string" &&
          profile.name.trim().length > 0 &&
          typeof profile.city === "string" &&
          profile.city.trim().length > 0 &&
          typeof profile.country === "string" &&
          profile.country.trim().length > 0;

        // filter out entries that might be default or missing details
        return (
          !profile.is_video &&
          isAdminAdded
          // && isActuallyVerified // Uncomment if you want to restrict to only verified profiles
        );
      });

      // Preload first few images for better perceived performance
      const imagesToPreload = nonVideoProfiles.slice(0, 6);
      imagesToPreload.forEach(profile => {
        if (profile.images && profile.images[0]) {
          const img = new Image();
          img.src = profile.images[0];
        }
      });

      setProfiles(nonVideoProfiles);

      // Fetch settings and visible profiles
      await fetchSettings();
    } catch (err) {
      setError("Failed to load profiles. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load profiles",
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
        .eq('id', 'default')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log("No settings found, using defaults");
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
        return "grid-cols-2 gap-4 sm:gap-6";
      case "grid-1":
        return "grid-cols-1 max-w-md mx-auto gap-6";
      default:
        return "grid-cols-2 gap-4 sm:gap-6";
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="container pt-24 pb-12 px-4">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Discover Profiles</h1>
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : profiles.length > 0 ? (
          <div className={`grid ${getGridClass()}`}>
            {profiles.slice(0, visibleProfiles).map((profile, index) => (
              <Link key={profile.id} to={`/profile/${profile.id}`} className="block h-full relative">
                <span className="absolute top-2 left-2 z-10 bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-md text-xs sm:text-base">{index + 1}</span>
                <ProfileCard 
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  imageUrl={profile.images?.[0] || '/placeholder.svg'}
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
            <p className="text-lg text-gray-500">No profiles found</p>
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
              Load More Profiles
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
