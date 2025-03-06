
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data: adminUser } = await supabase.auth.getUser(userId);
    console.log("Checking admin status for user:", adminUser?.user);
    
    // Check for admin email - this is the email we use when logging in with admin/admin
    return adminUser?.user?.email === 'admin@escortsreloaded.com';
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
};
