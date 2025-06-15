import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Power } from "lucide-react";
import { useLocation } from "react-router-dom";
import { checkIsAdmin } from "@/utils/adminUtils";

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

export function MaintenanceCheck({ children }: MaintenanceCheckProps) {
  const location = useLocation();
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
          setMaintenanceMessage(
            data.maintenance_message ||
              "The site is currently under maintenance. Please check back later."
          );
        }
      } catch (error) {
        console.error('Error checking site status:', error);
        setIsOnline(true);
      } finally {
        setLoading(false);
      }
    };

    checkSiteStatus();

    const subscription = supabase
      .channel('site_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_status',
          filter: 'id=eq.global',
        },
        (payload) => {
          setIsOnline(payload.new.is_online);
          setMaintenanceMessage(
            payload.new.maintenance_message ||
              "The site is currently under maintenance. Please check back later."
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // If we're still loading or checking admin, show spinner
  if (loading || isAdmin === null) {
    // But: if we're on /admin-login or /dashboard, show spinner for a short time ONLY, then let the page through so user doesn't get stuck
    if (
      location.pathname === "/admin-login" ||
      location.pathname === "/dashboard"
    ) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
        </div>
      );
    }

    // For all other pages, normal loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // Allow /admin-login at all times
  if (location.pathname === "/admin-login") {
    return <>{children}</>;
  }

  // During maintenance, allow admins to access the dashboard and all subpages underneath /dashboard
  // (use startsWith in case your dashboard route is more complex, e.g. /dashboard/settings etc)
  if (!isOnline && !isAdmin) {
    // Allow admin-accessible paths anyway (i.e., /admin-login)
    if (
      location.pathname === "/admin-login" ||
      location.pathname.startsWith("/dashboard")
    ) {
      return <>{children}</>;
    }

    // Everyone else gets maintenance screen
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

  // Otherwise, let everything through
  return <>{children}</>;
}
