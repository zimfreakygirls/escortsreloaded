import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin } from "@/utils/adminUtils";
import { gsap } from "gsap";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProfilesTabContent } from "@/components/dashboard/ProfilesTabContent";
import { PaymentVerificationsTabContent } from "@/components/dashboard/PaymentVerificationsTabContent";
import { CountryManager } from "@/components/dashboard/CountryManager";
import { UsersTabContent } from "@/components/dashboard/UsersTabContent";
import { TabsContent } from "@/components/ui/tabs";
import { 
  DashboardTabContent, 
  VideosTabContent, 
  ContactsTabContent, 
  SettingsTabContent
} from "@/components/dashboard/TabsContent";
import { AdminUsersTabContent } from "@/components/dashboard/AdminUsersTabContent";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeSettings, setActiveSettings] = useState<any>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log("Initializing dashboard...");
        
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Session data:", sessionData);
        
        if (!sessionData.session) {
          console.log("No session found, redirecting to admin login");
          navigate("/admin-login");
          return;
        }

        setSession(sessionData.session);

        const adminStatus = await checkIsAdmin(sessionData.session.user.id);
        console.log("Admin status:", adminStatus);
        
        if (!adminStatus) {
          console.log("Not admin, redirecting to home");
          navigate("/");
          return;
        }

        setIsAdmin(true);
        
        // Load data
        loadProfiles();
        loadSettings();

      } catch (error) {
        console.error('Dashboard initialization error:', error);
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      // Only handle sign out events to prevent infinite loops
      if (event === 'SIGNED_OUT' && !session) {
        navigate("/admin-login");
        return;
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const loadProfiles = async () => {
    try {
      console.log("Loading profiles...");
      
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setProfiles([]);
        return;
      }

      // Filter out any records that don't have proper profile data (name, age, location, etc.)
      const validProfiles = (allProfiles || []).filter(profile => 
        profile.name && 
        profile.age && 
        profile.location && 
        profile.city && 
        profile.country &&
        profile.price_per_hour !== null &&
        profile.price_per_hour !== undefined
      );

      console.log("Valid profiles loaded:", validProfiles?.length || 0);
      setProfiles(validProfiles);
      
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 md:py-8 lg:py-24 px-4 dashboard-content">
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
        
        <AdminUsersTabContent />
      </DashboardTabs>
      </div>
    </div>
  );
}
