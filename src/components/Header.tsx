import { Heart, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <span className="text-xl font-bold">OneNight</span>
        </Link>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Link to="/login">
            <Button>
              <User className="w-5 h-5 mr-2" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};