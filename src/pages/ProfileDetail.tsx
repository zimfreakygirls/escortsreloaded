
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Phone, Play, Lock } from "lucide-react";
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Status badges */}
          <div className="flex gap-2 mb-4">
            {profile.is_premium && (
              <Badge className="bg-amber-500 text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Premium
              </Badge>
            )}
            {profile.is_verified && (
              <Badge className="bg-blue-500 text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Verified
              </Badge>
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
              
              {profile.phone ? (
                session ? (
                  <div className="flex items-center gap-2 text-base sm:text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{profile.phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-base sm:text-lg border border-primary/30 rounded-md p-2 bg-primary/5">
                    <Lock className="h-5 w-5 text-primary" />
                    <Link to="/login" className="text-primary hover:underline">Login to view contact</Link>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
