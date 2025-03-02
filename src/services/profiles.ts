
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  country: string;
  price_per_hour: number;
  phone?: string;
  video_url?: string;
  images: string[];
  is_verified?: boolean;
  is_premium?: boolean;
}

export const fetchProfiles = async (): Promise<Profile[]> => {
  try {
    console.log('Fetching profiles...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      throw error;
    }

    console.log('Fetched profiles:', data);
    return data || [];
  } catch (error: any) {
    console.error('Fetch error:', error);
    toast({
      title: "Error",
      description: "Failed to fetch profiles",
      variant: "destructive",
    });
    throw error;
  }
};
