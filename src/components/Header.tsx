import { Heart, User, MessageSquare, Mail, Video, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <span className="text-xl font-bold">OneNight</span>
        </Link>
        
        <div className="flex-1 flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate('/country/zambia')}>
                Zambia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/country/zimbabwe')}>
                Zimbabwe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/country/malawi')}>
                Malawi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/videos">
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="icon">
              <Mail className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="hidden sm:flex">
              <User className="w-5 h-5 mr-2" />
              Login
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};