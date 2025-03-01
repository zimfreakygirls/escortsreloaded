
import { Heart, User, MessageSquare, Mail, Video, Globe } from "lucide-react";
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

export const Header = () => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-14 items-center justify-between px-4 gap-4">
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <Heart className="w-5 h-5 text-primary" fill="currentColor" />
          <span className="text-lg font-semibold">OneNight</span>
        </Link>
        
        <nav className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Globe className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {countries.map((country) => (
                <DropdownMenuItem 
                  key={country.id} 
                  onClick={() => navigate(`/country/${country.name.toLowerCase()}`)}
                >
                  {country.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="flex items-center gap-1">
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
