import { Heart, User, MessageSquare, Mail, Video, Globe, LogOut, Shield, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/utils/adminUtils";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

export function Header() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Check admin status
      if (data.session?.user?.id) {
        const adminStatus = await checkIsAdmin(data.session.user.id);
        setIsAdmin(adminStatus);
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      // Check admin status
      if (session?.user?.id) {
        const adminStatus = await checkIsAdmin(session.user.id);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto bg-gradient-to-br from-[#292741] to-[#1e1c2e] border border-[#9b87f5]/30 shadow-xl rounded-xl">
              {countries.length > 0 ? (
                countries.map((country) => (
                  <DropdownMenuItem key={country.id} asChild>
                    <Link
                      to={`/country/${encodeURIComponent(country.name.toLowerCase())}`}
                      className="w-full cursor-pointer hover:bg-[#9b87f5]/20 rounded-lg transition-colors"
                    >
                      {country.name}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No countries available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Only show admin dashboard icon if user is admin */}
          {isAdmin && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Shield className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </nav>

        {/* Right side section - authentication/profile */}
        <div className="flex items-center gap-2">
          {/* Remove duplicate country dropdown and only show it on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary md:hidden">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto bg-gradient-to-br from-[#292741] to-[#1e1c2e] border border-[#ff719A]/30 shadow-xl rounded-xl">
              {countries.length > 0 ? (
                countries.map((country) => (
                  <DropdownMenuItem key={country.id} asChild>
                    <Link
                      to={`/country/${encodeURIComponent(country.name.toLowerCase())}`}
                      className="w-full cursor-pointer hover:bg-[#ff719A]/20 rounded-lg transition-colors p-2"
                    >
                      {country.name}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No countries available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
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
          
          {/* Only show admin dashboard icon if user is admin and on mobile */}
          {isAdmin && (
            <Link to="/dashboard" className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Shield className="w-4 h-4" />
              </Button>
            </Link>
          )}
          
          {/* Replace direct login button with dropdown menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-[#292741] to-[#1e1c2e] border border-[#9b87f5]/30 shadow-xl rounded-xl">
                <div className="px-3 py-2 text-sm font-medium text-white">
                  {session.user?.email || 'Account'}
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                  }}
                  className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden inline-flex h-9 w-9">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-[#292741] to-[#1e1c2e] border border-[#9b87f5]/30 shadow-xl rounded-xl">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Keep visible login button on larger screens */}
          {!session && (
            <Link to="/login" className="hidden sm:inline-flex">
              <Button className="inline-flex items-center h-9 px-3">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
