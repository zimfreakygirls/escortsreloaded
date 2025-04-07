
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin } from "@/utils/adminUtils";
import { gsap } from "gsap";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProfilesTabContent } from "@/components/dashboard/ProfilesTabContent";
import { UsersTabContent } from "@/components/dashboard/UsersTabContent";
import { 
  DashboardTabContent, 
  CountriesTabContent, 
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
      }
      
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (!session) {
        navigate("/admin-login");
        return;
      }

      const adminStatus = await checkIsAdmin(session.user.id);
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        navigate("/");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'default')
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        setActiveSettings(data || {
          id: "default",
          profiles_per_page: 6,
          currency: "USD",
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (session) {
      fetchProfiles();
      fetchSettings();
    }
  }, [session]);

  const handleProfileCreated = () => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        
        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error refreshing profiles:', error);
      }
    };
    
    fetchProfiles();
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
    <div className="container mx-auto py-24 px-4">
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
        <CountriesTabContent />
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
