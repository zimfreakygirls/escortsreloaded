import { Heart, Search, User, Mail, Video, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
          <span className="text-xl font-bold">OneNight</span>
        </Link>
        
        <div className="flex-1 flex items-center justify-center gap-4">
          <Select defaultValue="zambia">
            <SelectTrigger className="w-[180px]">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zambia">Zambia</SelectItem>
              <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
              <SelectItem value="malawi">Malawi</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search Profiles</DialogTitle>
              </DialogHeader>
              <Input placeholder="Search by name or location..." className="mt-4" />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/videos">
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <a href="mailto:contact@onenight.com">
              <Mail className="w-5 h-5" />
            </a>
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