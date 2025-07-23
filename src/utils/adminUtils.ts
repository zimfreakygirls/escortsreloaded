
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Only check if the user is in the admin_users table
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
