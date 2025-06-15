
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Power, PowerOff } from "lucide-react";

interface SiteStatus {
  id: string;
  is_online: boolean;
  maintenance_message: string;
  updated_at: string;
  updated_by: string | null;
}

export function SiteStatusManager() {
  const { toast } = useToast();
  const [siteStatus, setSiteStatus] = useState<SiteStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  const fetchSiteStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_status')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) throw error;

      setSiteStatus(data);
      setMaintenanceMessage(data.maintenance_message || "The site is currently under maintenance. Please check back later.");
    } catch (error: any) {
      console.error('Error fetching site status:', error);
      toast({
        title: "Error",
        description: "Failed to load site status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSiteStatus = async (isOnline: boolean) => {
    try {
      setUpdating(true);
      
      const { data: session } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('site_status')
        .update({
          is_online: isOnline,
          maintenance_message: maintenanceMessage,
          updated_at: new Date().toISOString(),
          updated_by: session.session?.user.id
        })
        .eq('id', 'global');

      if (error) throw error;

      setSiteStatus(prev => prev ? {
        ...prev,
        is_online: isOnline,
        maintenance_message: maintenanceMessage,
        updated_at: new Date().toISOString()
      } : null);

      toast({
        title: "Success",
        description: `Site is now ${isOnline ? 'online' : 'offline'}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error updating site status:', error);
      toast({
        title: "Error",
        description: "Failed to update site status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSiteStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {siteStatus?.is_online ? (
            <Power className="h-5 w-5 text-green-500" />
          ) : (
            <PowerOff className="h-5 w-5 text-red-500" />
          )}
          Site Status Kill Switch
        </CardTitle>
        <CardDescription>
          Control whether the website is accessible to users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="site-online" className="text-sm font-medium">
            Site Status
          </Label>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${siteStatus?.is_online ? 'text-green-500' : 'text-red-500'}`}>
              {siteStatus?.is_online ? 'Online' : 'Offline'}
            </span>
            <Switch
              id="site-online"
              checked={siteStatus?.is_online || false}
              onCheckedChange={(checked) => updateSiteStatus(checked)}
              disabled={updating}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance-message">Maintenance Message</Label>
          <Textarea
            id="maintenance-message"
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Enter a message to display when the site is offline"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => updateSiteStatus(false)}
            variant="destructive"
            disabled={updating || !siteStatus?.is_online}
            className="flex-1"
          >
            <PowerOff className="h-4 w-4 mr-2" />
            Take Site Offline
          </Button>
          <Button
            onClick={() => updateSiteStatus(true)}
            variant="default"
            disabled={updating || siteStatus?.is_online}
            className="flex-1"
          >
            <Power className="h-4 w-4 mr-2" />
            Bring Site Online
          </Button>
        </div>

        {siteStatus?.updated_at && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(siteStatus.updated_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
