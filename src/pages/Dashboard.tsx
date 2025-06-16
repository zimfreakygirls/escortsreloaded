
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
    let mounted = true;

    const initializeDashboard = async () => {
      try {
        console.log("Initializing dashboard...");
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Session data:", sessionData);
        
        if (!mounted) return;
        
        if (!sessionData.session) {
          console.log("No session found, redirecting to admin login");
          navigate("/admin-login");
          return;
        }

        setSession(sessionData.session);

        // Check admin status
        console.log("Checking admin status...");
        const adminStatus = await checkIsAdmin(sessionData.session.user.id);
        console.log("Admin status:", adminStatus);
        
        if (!mounted) return;
        
        if (!adminStatus) {
          console.log("Not admin, redirecting to home");
          navigate("/");
          return;
        }

        setIsAdmin(true);
        
        // Load profiles and settings
        await Promise.all([
          loadProfiles(),
          loadSettings()
        ]);

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        if (mounted) {
          navigate("/admin-login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const loadProfiles = async () => {
      try {
        console.log("Loading profiles...");
        
        // Get all profiles first
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Try to get user status data to filter out user registrations
        const { data: userStatusData } = await supabase
          .from('user_status')
          .select('user_id');
        
        let adminProfiles = allProfiles || [];
        
        // If user_status table has data, filter out those user IDs
        if (userStatusData && userStatusData.length > 0) {
          const userIds = userStatusData.map(u => u.user_id);
          adminProfiles = adminProfiles.filter(profile => !userIds.includes(profile.id));
          console.log("Filtered profiles, excluding user registrations:", userIds);
        }
        
        console.log("Admin profiles loaded:", adminProfiles.length);
        setProfiles(adminProfiles);
        
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles([]);
      }
    };

    const loadSettings = async () => {
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
        console.error('Error loading settings:', error);
      }
    };

    initializeDashboard();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (!session) {
        navigate("/admin-login");
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(session.user.id);
        if (!adminStatus) {
          navigate("/");
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate("/admin-login");
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Add GSAP animations after loading is complete
  useEffect(() => {
    if (!loading && isAdmin) {
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
    }
  }, [loading, isAdmin]);

  const handleProfileCreated = () => {
    // Refresh profiles after creation
    const loadProfiles = async () => {
      try {
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        const { data: userStatusData } = await supabase
          .from('user_status')
          .select('user_id');
        
        let adminProfiles = allProfiles || [];
        
        if (userStatusData && userStatusData.length > 0) {
          const userIds = userStatusData.map(u => u.user_id);
          adminProfiles = adminProfiles.filter(profile => !userIds.includes(profile.id));
        }
        
        setProfiles(adminProfiles);
      } catch (error) {
        console.error('Error refreshing profiles:', error);
      }
    };
    
    loadProfiles();
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
    <div className="container mx-auto py-6 md:py-24 px-2 md:px-4 dashboard-content">
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
