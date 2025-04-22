
import { supabase } from "@/integrations/supabase/client";

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
    throw error;
  }
};

export const ensureProfileImagesBucket = async () => {
  try {
    console.log('Checking profile-images bucket...');
    const { data, error } = await supabase.storage.getBucket('profile-images');
    
    if (error && error.message.includes('does not exist')) {
      console.log('Profile-images bucket does not exist, creating...');
      await supabase.storage.createBucket('profile-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log('Created profile-images bucket');
    } else if (error) {
      console.error('Error checking profile-images bucket:', error);
    } else {
      console.log('Profile-images bucket exists');
    }
  } catch (error) {
    console.error('Error ensuring profile-images bucket:', error);
  }
};
