
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Power } from "lucide-react";
import { checkIsAdmin } from "@/utils/adminUtils";

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

export function MaintenanceCheck({ children }: MaintenanceCheckProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSiteStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('site_status')
          .select('is_online, maintenance_message')
          .eq('id', 'global')
          .single();

        if (error) {
          console.error('Error checking site status:', error);
          setIsOnline(true);
        } else {
          setIsOnline(data.is_online);
          setMaintenanceMessage(data.maintenance_message || "The site is currently under maintenance. Please check back later.");
        }
      } catch (error) {
        console.error('Error checking site status:', error);
        setIsOnline(true);
      } finally {
        setLoading(false);
      }
    };

    checkSiteStatus();

    // Site status subscription
    const subscription = supabase
      .channel('site_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_status',
          filter: 'id=eq.global'
        },
        (payload) => {
          setIsOnline(payload.new.is_online);
          setMaintenanceMessage(payload.new.maintenance_message || "The site is currently under maintenance. Please check back later.");
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if user is admin to bypass maintenance
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user?.id) {
        setIsAdmin(false);
      } else {
        const _isAdmin = await checkIsAdmin(data.session.user.id);
        setIsAdmin(_isAdmin);
      }
    };
    checkAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user?.id) {
        setIsAdmin(false);
      } else {
        const _isAdmin = await checkIsAdmin(session.user.id);
        setIsAdmin(_isAdmin);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // If maintenance kill switch is ON, but user is admin, allow access
  if (!isOnline && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6">
            <Power className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Site Maintenance</h1>
            <p className="text-gray-300">{maintenanceMessage}</p>
          </div>
          <div className="text-sm text-gray-400">
            We apologize for any inconvenience and appreciate your patience.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
