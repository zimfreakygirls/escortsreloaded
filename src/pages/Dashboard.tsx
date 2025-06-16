
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin } from "@/utils/adminUtils";
import { gsap } from "gsap";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProfilesTabContent } from "@/components/dashboard/ProfilesTabContent";
import { UsersTabContent } from "@/components/dashboard/UsersTabContent";
import { PaymentVerificationsTabContent } from "@/components/dashboard/PaymentVerificationsTabContent";
import { CountryManager } from "@/components/dashboard/CountryManager";
import { TabsContent } from "@/components/ui/tabs";
import { 
  DashboardTabContent, 
  VideosTabContent, 
  ContactsTabContent, 
  SettingsTabContent, 
  AdminTabContent 
} from "@/components/dashboard/TabsContent";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeSettings, setActiveSettings] = useState<any>(null);

  useEffect(() => {
    gsap.fromTo(
      ".dashboard-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(
      ".tabs-trigger",
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "back.out(1.7)",
        delay: 0.3
      }
    );

    const checkSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (!data.session) {
          navigate("/admin-login");
          return;
        }

        const adminStatus = await checkIsAdmin(data.session.user.id);
        setIsAdmin(adminStatus);

        if (!adminStatus) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (!session) {
        navigate("/admin-login");
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(session.user.id);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          navigate("/");
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate("/admin-login");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!session) return;
      
      try {
        console.log("Fetching admin-created profiles...");
        
        // Try to get user IDs from user_status table to exclude user registrations
        const { data: userStatusData, error: userStatusError } = await supabase
          .from('user_status')
          .select('user_id');
        
        let query = supabase.from('profiles').select('*');
        
        // If user_status table exists and has data, exclude those user IDs
        if (!userStatusError && userStatusData && userStatusData.length > 0) {
          const userIds = userStatusData.map(u => u.user_id);
          query = query.not('id', 'in', `(${userIds.join(',')})`);
          console.log("Excluding user registration IDs:", userIds);
        }
        
        const { data: profilesData, error: profilesError } = await query;
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setProfiles([]);
        } else {
          setProfiles(profilesData || []);
          console.log("Admin profiles fetched:", profilesData?.length || 0);
        }
      } catch (error) {
        console.error('Unexpected error fetching profiles:', error);
        setProfiles([]);
      }
    };

    const fetchSettings = async () => {
      if (!session) return;
      
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'default')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
        }
        
        setActiveSettings(data || {
          id: "default",
          profiles_per_page: 6,
          currency: "USD",
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        setActiveSettings({
          id: "default",
          profiles_per_page: 6,
          currency: "USD",
          created_at: new Date().toISOString()
        });
      }
    };

    fetchProfiles();
    fetchSettings();
  }, [session]);

  const handleProfileCreated = () => {
    // Refresh profiles after creation
    if (session) {
      const fetchProfiles = async () => {
        try {
          console.log("Refreshing profiles after creation...");
          
          const { data: userStatusData, error: userStatusError } = await supabase
            .from('user_status')
            .select('user_id');
          
          let query = supabase.from('profiles').select('*');
          
          if (!userStatusError && userStatusData && userStatusData.length > 0) {
            const userIds = userStatusData.map(u => u.user_id);
            query = query.not('id', 'in', `(${userIds.join(',')})`);
          }
          
          const { data: profilesData, error: profilesError } = await query;
          
          if (!profilesError) {
            setProfiles(profilesData || []);
          }
        } catch (error) {
          console.error('Error refreshing profiles:', error);
        }
      };
      
      fetchProfiles();
    }
  };

  const handleSettingsChange = async (newSettings: any) => {
    setActiveSettings(newSettings);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-[#9b87f5] rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-24 px-2 md:px-4">
      <DashboardHeader onLogout={handleLogout} />
      
      <DashboardTabs>
        <DashboardTabContent />

        <ProfilesTabContent 
          profiles={profiles} 
          onProfileCreated={handleProfileCreated} 
          currencySymbol={activeSettings?.currency === 'USD' ? '$' : 
                          activeSettings?.currency === 'EUR' ? '€' : 
                          activeSettings?.currency === 'GBP' ? '£' : '$'} 
        />

        <UsersTabContent />
        
        <PaymentVerificationsTabContent />
        
        <TabsContent value="countries" className="space-y-4">
          <CountryManager />
        </TabsContent>
        
        <VideosTabContent />
        <ContactsTabContent />
        
        <SettingsTabContent 
          settings={activeSettings} 
          onSettingsChange={handleSettingsChange} 
        />
        
        <AdminTabContent />
      </DashboardTabs>
    </div>
  );
}
