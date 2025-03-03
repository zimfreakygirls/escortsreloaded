
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Phone, Play, Lock, BadgeCheck, Crown } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProfile();
      checkSession();
    }
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [id]);

  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profile details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center">Profile not found</div>
        </main>
      </div>
    );
  }

  // Determine if we should show the phone number
  // Show if profile is verified OR (profile is not premium OR user is logged in)
  const shouldShowPhone = profile.phone && (profile.is_verified || (!profile.is_premium || session));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Status badges */}
          <div className="flex gap-2 mb-4">
            {profile.is_premium && (
              <div className="bg-amber-500 rounded-full text-white text-xs font-medium py-1 px-3 shadow-lg flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                <span>Premium</span>
              </div>
            )}
            {profile.is_verified && (
              <div className="bg-blue-500 rounded-full text-white text-xs font-medium py-1 px-3 shadow-lg flex items-center">
                <BadgeCheck className="w-4 h-4 mr-1" />
                <span>Verified</span>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={profile.images[selectedImage] || '/placeholder.svg'} 
                alt={profile.name}
                className="w-full h-[300px] sm:h-[500px] object-cover"
              />
            </div>
            
            {profile.video_url && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90">
                      <Play className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <video controls className="w-full">
                      <source src={profile.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          
          {profile.images && profile.images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {profile.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${profile.name} ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}, {profile.age}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{profile.location}, {profile.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span>${profile.price_per_hour}/hr</span>
              </div>
              
              {shouldShowPhone ? (
                <div className="flex items-center gap-2 text-base sm:text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{profile.phone}</span>
                </div>
              ) : profile.phone && profile.is_premium && !session ? (
                <div className="flex items-center gap-2 text-base sm:text-lg border border-primary/30 rounded-md p-2 bg-primary/5">
                  <Lock className="h-5 w-5 text-primary" />
                  <Link to="/login" className="text-primary hover:underline">Login to view contact</Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
