
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Power } from "lucide-react";

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

export function MaintenanceCheck({ children }: MaintenanceCheckProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

    // Set up real-time subscription to site status changes
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

  // Always allow /admin-login and /dashboard access regardless of isOnline state
  const path = location.pathname;
  const adminRoutes = ["/admin-login", "/dashboard"];

  // While loading, show spinner for admin routes and maintenance-check for others
  if (loading) {
    if (adminRoutes.includes(path)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // If the site is offline but we're on admin-login or dashboard, allow admin access
  if (!isOnline && adminRoutes.includes(path)) {
    return <>{children}</>;
  }

  // If site is offline (maintenance) and not an allowed route, show maintenance message
  if (!isOnline) {
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

  // By default, render children (site is online)
  return <>{children}</>;
}
