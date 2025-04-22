
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Use auth.getUser() to get the user's email
    const { data: authUser } = await supabase.auth.getUser();
    
    // If the user's email is admin@escortsreloaded.com, they're an admin
    if (authUser?.user?.email === 'admin@escortsreloaded.com') {
      return true;
    }
    
    // Also check if the user is in the admin_users table
    const { data: adminRecord, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error checking admin_users table:", error);
      return false;
    }
    
    return !!adminRecord;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
};
