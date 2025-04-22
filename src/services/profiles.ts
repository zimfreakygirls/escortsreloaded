
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
    // Import and use toast directly here can cause circular dependencies
    // So we log the error instead
    throw error;
  }
};

export const ensureProfileImagesBucket = async () => {
  try {
    const { data, error } = await supabase.storage.getBucket('profile-images');
    
    if (error && error.message.includes('does not exist')) {
      await supabase.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log('Created profile-images bucket');
    }
  } catch (error) {
    console.error('Error ensuring profile-images bucket:', error);
  }
};
