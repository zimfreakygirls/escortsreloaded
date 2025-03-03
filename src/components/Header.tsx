
import { Heart, User, MessageSquare, Mail, Video, Flag, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

export function Header() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);

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
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
      <div className="container flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-[#ff719A]" />
            <span className="font-bold text-xl bg-gradient-to-r from-[#ff719A] to-[#f97316] bg-clip-text text-transparent ml-1">OneNight</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/premium" className="text-sm font-medium hover:text-primary transition-colors">
            Premium
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Countries
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
          
          <Link to="/videos" className="text-sm font-medium hover:text-primary transition-colors">
            Videos
          </Link>
          <Link to="/chat" className="text-sm font-medium hover:text-primary transition-colors">
            Chat
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary">
                <Globe className="w-5 h-5" />
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
          <Link to="/login" className="inline-flex">
            <Button className="hidden sm:inline-flex items-center h-9 px-3">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden inline-flex h-9 w-9">
              <User className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
