
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Shield } from "lucide-react";

interface AdminSettings {
  signup_enabled: boolean;
  signup_code: string;
}

export function AdminSignupSettings() {
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [signupCode, setSignupCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('signup_enabled, signup_code')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSignupEnabled(data.signup_enabled);
          setSignupCode(data.signup_code);
        }
      } catch (error: any) {
        console.error("Error fetching admin settings:", error);
        toast({
          title: "Error",
          description: "Failed to load admin signup settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          signup_enabled: signupEnabled,
          signup_code: signupCode,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default');
      
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Admin signup settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error saving admin settings:", error);
      toast({
        title: "Error",
        description: "Failed to save admin signup settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-[#9b87f5]/30 bg-gradient-to-br from-[#292741]/80 to-[#1e1c2e]/80 backdrop-blur-md shadow-2xl">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#9b87f5]/30 bg-gradient-to-br from-[#292741]/80 to-[#1e1c2e]/80 backdrop-blur-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent flex items-center">
          <Shield className="mr-2 h-5 w-5 text-[#9b87f5]" />
          Admin Signup Settings
        </CardTitle>
        <CardDescription className="text-gray-400">
          Control whether new admin accounts can be created
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Enable Admin Signup</p>
              <p className="text-xs text-gray-400 mt-1">
                When enabled, new admins can be created at /admin-signup
              </p>
            </div>
            <Switch 
              checked={signupEnabled} 
              onCheckedChange={setSignupEnabled}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Signup Code</label>
            <Input
              type="text"
              value={signupCode}
              onChange={(e) => setSignupCode(e.target.value)}
              className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white"
              placeholder="Enter a secret code required for admin signup"
            />
            <p className="text-xs text-gray-400">
              This code will be required to create new admin accounts
            </p>
          </div>
          
          <Button 
            onClick={saveSettings} 
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white"
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Settings"
            )}
          </Button>
          
          <div className="text-center text-xs text-gray-400 border-t border-gray-800 pt-4 mt-6">
            <p>
              Admin signup page is available at{" "}
              <span className="text-[#9b87f5]">/admin-signup</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
