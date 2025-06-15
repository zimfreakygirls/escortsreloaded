
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useProfileRealtime(id: string | undefined) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (id) {
      fetchProfile();
    }
    
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
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [id]);

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

  return { profile, loading };
}
