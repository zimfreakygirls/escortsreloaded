
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Check if the user is an admin by email
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting user:", userError);
      return false;
    }
    
    // Admin check by email
    if (userData?.user?.email === 'admin@escortsreloaded.com') {
      return true;
    }
    
    // Also check if the user is in the admin_users table
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') {
      console.error("Error checking admin_users table:", adminError);
      return false;
    }
    
    return !!adminRecord;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
};
