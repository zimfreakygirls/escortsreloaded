
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/profile-card/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  images: string[];
  city: string;
  country: string;
  phone: string;
  is_verified: boolean;
  is_premium: boolean;
  price_per_hour: number;
  video_url?: string;
}

export default function Index() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [profilesPerPage, setProfilesPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState<any>(null);
  const [viewMode, setViewMode] = useState<string>("grid-3");

  useEffect(() => {
    const fetchProfiles = async () => {
      console.log("Fetching profiles...");
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('country', 'Video') // Exclude video entries from discover page
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log("Fetched profiles:", data);
        setProfiles(data || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });

        if (error) throw error;
        setCountries(data || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'default')
          .single();

        if (error) throw error;
        setSettings(data || { profiles_per_page: 6, currency: "USD" });
        setProfilesPerPage(data?.profiles_per_page || 6);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setProfilesPerPage(6);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const countryMatch = selectedCountry ? profile.country === selectedCountry : true;

    return (
      searchRegex.test(profile.name) &&
      countryMatch
    );
  });

  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const currencySymbol = settings?.currency === 'USD' ? '$' :
    settings?.currency === 'EUR' ? '€' :
      settings?.currency === 'GBP' ? '£' : '$';

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <Card className="w-full md:w-1/3 bg-card">
            <CardHeader>
              <CardTitle>Search Profiles</CardTitle>
              <CardDescription>
                Find the perfect match by name or keyword
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Enter name or keyword"
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-background border-input"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {countries.map((country: any) => (
                      <SelectItem key={country.id} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="w-full md:w-2/3 flex items-center justify-end">
            <div className="inline-flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className={`px-3 py-2 rounded-md ${viewMode === 'grid-3' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'hover:bg-muted'}`}
                onClick={() => setViewMode('grid-3')}
              >
                Grid View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`px-3 py-2 rounded-md ${viewMode === 'list' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'hover:bg-muted'}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="mt-2 text-muted-foreground">Loading profiles...</p>
          </div>
        ) : paginatedProfiles.length > 0 ? (
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {paginatedProfiles.map((profile) => (
              <Link key={profile.id} to={`/profile/${profile.id}`}>
                <ProfileCard
                  name={profile.name}
                  age={profile.age}
                  location={profile.location}
                  imageUrl={profile.images[0] || '/placeholder.svg'}
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
            <p className="text-muted-foreground">No profiles found.</p>
          </div>
        )}

        {totalPages > 1 && (
          <Card className="mt-8 bg-card">
            <CardContent className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
