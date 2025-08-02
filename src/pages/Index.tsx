
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/profile-card/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CountrySelectionDialog } from "@/components/CountrySelectionDialog";

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
  const [userLocation, setUserLocation] = useState<string>('Zimbabwe');
  const [showCountryDialog, setShowCountryDialog] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    checkShowCountryDialog();
    
    // Initialize location detection and load profiles in sequence
    const initializeData = async () => {
      await detectUserLocation();
      await loadProfiles();
    };
    
    initializeData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const detectUserLocation = async (): Promise<string> => {
    try {
      // Try to get user's location from IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const detectedCountry = data.country_name;
        console.log('Detected country:', detectedCountry);
        
        // Map detected country to our supported countries
        const countryMap: { [key: string]: string } = {
          'Zimbabwe': 'Zimbabwe',
          'South Africa': 'South Africa', 
          'Nigeria': 'Nigeria',
          'Kenya': 'Kenya',
          'Ghana': 'Ghana',
          'Zambia': 'Zambia',
          'Botswana': 'Botswana',
          'Tanzania': 'Tanzania',
          'Uganda': 'Uganda'
        };
        
        const mappedCountry = countryMap[detectedCountry] || 'Zimbabwe'; // Default to Zimbabwe
        setUserLocation(mappedCountry);
        console.log('User location set to:', mappedCountry);
        return mappedCountry;
      } else {
        setUserLocation('Zimbabwe');
        return 'Zimbabwe';
      }
    } catch (error) {
      console.log('Could not detect location, defaulting to Zimbabwe');
      setUserLocation('Zimbabwe');
      return 'Zimbabwe';
    }
  };

  const checkShowCountryDialog = () => {
    // Only show for new visitors (check localStorage)
    const hasVisited = localStorage.getItem('hasVisitedSite');
    if (!hasVisited) {
      setTimeout(() => {
        setShowCountryDialog(true);
      }, 1000);
      localStorage.setItem('hasVisitedSite', 'true');
    }
  };

  const handleCountrySelection = (country: string) => {
    setShowCountryDialog(false);
    if (country === 'All Countries') {
      setUserLocation('');
    } else {
      setUserLocation(country);
    }
    // Reload profiles with the new country
    loadProfilesForCountry(country === 'All Countries' ? '' : country);
  };

  const handleCancelCountryDialog = () => {
    setShowCountryDialog(false);
  };

  const loadProfilesForCountry = async (country: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading profiles for country:", country || "All");
      
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // If country is specified, filter by it
      if (country && country.trim().length > 0) {
        query = query.ilike('country', country);
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) {
        throw profilesError;
      }

      console.log("Raw profiles data:", profilesData?.length || 0);

      const nonVideoProfiles = (profilesData || []).filter(profile => {
        const hasRealImage =
          Array.isArray(profile.images) &&
          profile.images.length > 0 &&
          profile.images[0] &&
          !profile.images[0].includes("placeholder.svg");

        const isAdminAdded =
          hasRealImage &&
          typeof profile.name === "string" &&
          profile.name.trim().length > 0 &&
          typeof profile.city === "string" &&
          profile.city.trim().length > 0 &&
          typeof profile.country === "string" &&
          profile.country.trim().length > 0;

        return !profile.is_video && isAdminAdded;
      });

      console.log("Filtered profiles:", nonVideoProfiles.length);

      const imagesToPreload = nonVideoProfiles.slice(0, 6);
      imagesToPreload.forEach(profile => {
        if (profile.images && profile.images[0]) {
          const img = new Image();
          img.src = profile.images[0];
        }
      });

      setProfiles(nonVideoProfiles);
      await fetchSettings();
    } catch (err) {
      console.error("Error loading profiles:", err);
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

  const loadProfiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading profiles for home page...");
      
      // Always detect user location fresh to ensure accuracy
      const detectedLocation = await detectUserLocation();
      console.log("Using location for filtering:", detectedLocation);
      
      // Filter by detected user location
      let { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('country', detectedLocation)
        .order('created_at', { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      console.log("Raw profiles data:", profilesData?.length || 0);

      const nonVideoProfiles = (profilesData || []).filter(profile => {
        const hasRealImage =
          Array.isArray(profile.images) &&
          profile.images.length > 0 &&
          profile.images[0] &&
          !profile.images[0].includes("placeholder.svg");

        const isAdminAdded =
          hasRealImage &&
          typeof profile.name === "string" &&
          profile.name.trim().length > 0 &&
          typeof profile.city === "string" &&
          profile.city.trim().length > 0 &&
          typeof profile.country === "string" &&
          profile.country.trim().length > 0;

        return !profile.is_video && isAdminAdded;
      });

      console.log("Filtered profiles:", nonVideoProfiles.length);

      const imagesToPreload = nonVideoProfiles.slice(0, 6);
      imagesToPreload.forEach(profile => {
        if (profile.images && profile.images[0]) {
          const img = new Image();
          img.src = profile.images[0];
        }
      });

      setProfiles(nonVideoProfiles);
      await fetchSettings();
    } catch (err) {
      console.error("Error loading profiles:", err);
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
          <div>
            <h1 className="text-2xl font-bold">Discover Profiles</h1>
            <p className="text-sm text-gray-600 mt-1">
              {userLocation ? `Showing profiles from ${userLocation}` : 'Showing all profiles'}
            </p>
          </div>
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
            {profiles.slice(0, visibleProfiles).map((profile) => (
              <Link key={profile.id} to={`/profile/${profile.id}`} className="block h-full">
                <ProfileCard 
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  imageUrl={profile.images?.[0] || '/placeholder.svg'}
                  viewMode={viewMode}
                  city={profile.city}
                  country={profile.country}
                  phone={profile.phone}
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

      <CountrySelectionDialog
        open={showCountryDialog}
        onCountrySelect={handleCountrySelection}
        onCancel={handleCancelCountryDialog}
      />
    </div>
  );
}
