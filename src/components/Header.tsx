
import { Heart, User, MessageSquare, Mail, Video, Globe, LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { CountryDropdownMenu } from "./CountryDropdownMenu";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/utils/adminUtils";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

export function Header() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });
          
        if (error) throw error;
        setCountries(data || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
    
    // Check current session
    const checkSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Only check admin status if session exists
      if (data.session?.user?.id) {
        const adminStatus = await checkIsAdmin(data.session.user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsLoading(true);
      
      // Check admin status on auth state change
      if (session?.user?.id) {
        const adminStatus = await checkIsAdmin(session.user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    
    // Clean up subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
      <div className="container flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <img src="/lovable-uploads/0aa7311a-71fc-4de3-b931-de22dfc1c9a5.png" alt="Escorts Reloaded" className="h-8" />
          </div>
        </Link>

        {/* Main navigation icons - visible on medium screens and up */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Heart className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to="/videos" className="text-sm font-medium hover:text-primary transition-colors">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Video className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to="/chat" className="text-sm font-medium hover:text-primary transition-colors">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Mail className="w-4 h-4" />
            </Button>
          </Link>
          
          <CountryDropdownMenu countries={countries} />
          
          {/* Only show admin dashboard icon if user is admin and not loading */}
          {!isLoading && isAdmin && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Shield className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side section - authentication/profile */}
        <div className="flex items-center gap-2">
          {/* Mobile country dropdown */}
          <CountryDropdownMenu countries={countries} isMobile={true} />
          
          {/* Only show these mobile navigation icons on small screens */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/chat">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/videos">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Video className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Mail className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* Only show admin dashboard icon if user is admin on mobile */}
          {!isLoading && isAdmin && (
            <Link to="/dashboard" className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Shield className="w-4 h-4" />
              </Button>
            </Link>
          )}
          
          {/* User dropdown menu */}
          <UserDropdownMenu 
            session={session}
            isAdmin={isAdmin}
            onLogout={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}
          />
        </div>
      </div>
    </header>
  );
}
