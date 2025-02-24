
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function CountryProfiles() {
  const { country } = useParams();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState(4);
  const { toast } = useToast();
  
  useEffect(() => {
    if (country) {
      fetchProfiles();
    }
  }, [country]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('country', country)
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
    setVisibleProfiles(prev => prev + 4);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8 capitalize">{country} Profiles</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.slice(0, visibleProfiles).map((profile) => (
            <Link key={profile.id} to={`/profile/${profile.id}`}>
              <ProfileCard 
                name={profile.name}
                age={profile.age}
                location={profile.location}
                imageUrl={profile.images[0] || '/placeholder.svg'}
              />
            </Link>
          ))}
        </div>
        
        {visibleProfiles < profiles.length && (
          <div className="mt-12 flex justify-center">
            <Button size="lg" className="gap-2" onClick={handleLoadMore}>
              <Plus className="w-5 h-5" />
              Load More
            </Button>
          </div>
        )}

        {profiles.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No profiles found for {country}
          </div>
        )}
      </main>
    </div>
  );
}
