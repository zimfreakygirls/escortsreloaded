import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProfileDetailHeader } from "@/components/profile-detail/ProfileDetailHeader";
import { ProfileImageGallery } from "@/components/profile-detail/ProfileImageGallery";
import { ProfileDetailsCard } from "@/components/profile-detail/ProfileDetailsCard";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  // ref to track if component is mounted (to avoid state updates on unmounted)
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (id) {
      fetchProfile();
      checkSession();
    }
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // --- Supabase realtime: Listen for changes to this profile ---
    let realtimeChannel: any = null;
    if (id) {
      realtimeChannel = supabase
        .channel('public:profiles:id=' + id)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${id}`
          },
          (payload) => {
            // Only update state if the right row is changed
            if (payload.new && mountedRef.current) {
              setProfile(payload.new);
            }
          }
        )
        .subscribe();
    }

    // Clean up subscription
    return () => {
      mountedRef.current = false;
      authListener?.subscription.unsubscribe();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
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

  // Only show phone if:
  // 1. It exists AND
  // 2. User is logged in (if profile is premium) OR profile is not premium
  const showPhone = profile.phone && ((!profile.is_premium && profile.is_verified) || (session && profile.is_verified));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <ProfileDetailHeader profile={profile} />
          <ProfileImageGallery profile={profile} />
          <ProfileDetailsCard profile={profile} showPhone={showPhone} session={session} />
        </div>
      </main>
    </div>
  );
}
