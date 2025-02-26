
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus, Grid2x2, LayoutList, GridIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState(6);
  const [viewMode, setViewMode] = useState("grid-2");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProfiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive",
      });
    }
  };

  const handleLoadMore = () => {
    setVisibleProfiles(prev => Math.min(prev + 6, profiles.length));
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "list":
        return "grid-cols-1 max-w-3xl mx-auto gap-6";
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6";
      case "grid-1":
        return "grid-cols-1 gap-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6";
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      <main className="container pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
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
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <GridIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="grid-2" 
              aria-label="Grid View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <Grid2x2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="list" 
              aria-label="List View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className={`grid ${getGridClass()}`}>
          {profiles.slice(0, visibleProfiles).map((profile) => (
            <Link key={profile.id} to={`/profile/${profile.id}`}>
              <ProfileCard 
                name={profile.name}
                age={profile.age}
                location={profile.location}
                imageUrl={profile.images[0] || '/placeholder.svg'}
                viewMode={viewMode}
                city={profile.city}
              />
            </Link>
          ))}
        </div>
        
        {visibleProfiles < profiles.length && (
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
