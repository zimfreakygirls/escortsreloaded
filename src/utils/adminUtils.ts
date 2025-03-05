
import { supabase } from "@/integrations/supabase/client";

// Check if the currently logged in user is an admin
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
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
    console.error("Failed to check admin status:", error);
    return false;
  }
};

// Hook to check admin status
export const useAdminStatus = (session: any) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (!session?.user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      const adminStatus = await checkIsAdmin(session.user.id);
      setIsAdmin(adminStatus);
      setLoading(false);
    };
    
    checkAdmin();
  }, [session]);
  
  return { isAdmin, loading };
};
