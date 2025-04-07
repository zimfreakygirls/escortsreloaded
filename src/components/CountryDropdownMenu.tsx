
import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Country {
  id: string;
  name: string;
  active: boolean;
}

interface CountryDropdownMenuProps {
  countries: Country[];
  isMobile?: boolean;
}

export function CountryDropdownMenu({ countries, isMobile = false }: CountryDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-9 w-9 ${isMobile ? 'md:hidden text-primary' : 'hidden md:flex'}`}
        >
          <Globe className={`${isMobile ? 'w-5 h-5' : 'h-4 w-4'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 max-h-80 overflow-y-auto bg-gradient-to-br from-[#292741] to-[#1e1c2e] border border-[#9b87f5]/30 shadow-xl rounded-xl"
      >
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
  );
}
