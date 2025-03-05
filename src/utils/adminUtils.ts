
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data: adminUser } = await supabase.auth.getUser(userId);
    
    // Hardcoded check for admin email
    if (adminUser?.user?.email === 'admin@escortsreloaded.com') {
      return true;
    }
    
    // As a fallback, check in the admin_users table if it exists
    try {
      // @ts-ignore - The admin_users table exists but isn't in the TypeScript types yet
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Failed to check admin status in table:", error);
      return false;
    }
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
};
