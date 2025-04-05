import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilesTable } from "@/components/dashboard/ProfilesTable";
import { CountryManager } from "@/components/CountryManager";
import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { ContactManager } from "@/components/dashboard/ContactManager";
import { VideoUploader } from "@/components/dashboard/VideoUploader";
import { AdminSettings } from "@/components/dashboard/AdminSettings";
import { AdminSignupSettings } from "@/components/dashboard/AdminSignupSettings";
import { checkIsAdmin } from "@/utils/adminUtils";
import { Shield, Users, Globe, Video, Settings, MessageSquare, UserCog, LogOut, PlusCircle, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeSettings, setActiveSettings] = useState<any>(null);
  const { toast } = useToast();
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
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

  const handleDeleteProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setProfiles(data || []);
      
      toast({
        title: "Profiles Updated",
        description: "The profiles list has been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing profiles:', error);
    }
  };

  const handleProfileCreated = () => {
    setShowProfileForm(false);
    handleDeleteProfile();
    toast({
      title: "Success",
      description: "Profile created successfully",
    });
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your website content and settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
      
      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList className="bg-[#1e1c2e] border border-[#9b87f5]/20 p-1 gap-1">
          <TabsTrigger value="profiles" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <Users className="h-4 w-4 mr-2" />
            <span>Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="countries" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <Globe className="h-4 w-4 mr-2" />
            <span>Countries</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <Video className="h-4 w-4 mr-2" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">
            <UserCog className="h-4 w-4 mr-2" />
            <span>Admin</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-semibold">Manage Profiles</h2>
            <Button 
              onClick={() => setShowProfileForm(true)}
              className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add New Profile</span>
            </Button>
          </div>
          
          <ProfilesTable 
            profiles={profiles} 
            onDelete={handleDeleteProfile} 
            currencySymbol={activeSettings?.currency === 'USD' ? '$' : 
                           activeSettings?.currency === 'EUR' ? '€' : 
                           activeSettings?.currency === 'GBP' ? '£' : '$'}
          />
          
          <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
            <DialogContent className="bg-[#292741] border-gray-800 text-white max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Create New Profile</DialogTitle>
              </DialogHeader>
              <ProfileForm onSuccess={handleProfileCreated} />
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="countries" className="space-y-4">
          <CountryManager />
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-4">
          <VideoUploader />
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <ContactManager />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <SettingsManager 
            settings={activeSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSettings />
          <AdminSignupSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
