
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
        console.log("Checking site status...");
        
        const { data, error } = await supabase
          .from('site_status')
          .select('is_online, maintenance_message')
          .eq('id', 'global')
          .single();

        if (error) {
          console.log('Site status check error (assuming online):', error);
          setIsOnline(true);
        } else {
          console.log('Site status:', data);
          setIsOnline(data.is_online);
          setMaintenanceMessage(data.maintenance_message || "The site is currently under maintenance. Please check back later.");
        }
      } catch (error) {
        console.log('Site status check failed (assuming online):', error);
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
          console.log('Site status updated:', payload.new);
          setIsOnline(payload.new.is_online);
          setMaintenanceMessage(payload.new.maintenance_message || "The site is currently under maintenance. Please check back later.");
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Always allow admin routes access regardless of maintenance status
  const path = location.pathname;
  const adminRoutes = ["/admin-login", "/dashboard"];
  const isAdminRoute = adminRoutes.includes(path);

  // Show loading only for a short time and only for non-admin routes
  if (loading && !isAdminRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // Always allow admin access regardless of site status
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // If site is offline and not an admin route, show maintenance message
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

  // Site is online, render children
  return <>{children}</>;
}
