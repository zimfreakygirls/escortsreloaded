import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Shield } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserDropdownMenuProps {
  session: any;
  isAdmin: boolean;
  onLogout: () => Promise<void>;
}

export function UserDropdownMenu({ session, isAdmin, onLogout }: UserDropdownMenuProps) {
  return (
    <>
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
            {/* Only show dashboard if isAdmin */}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            {isAdmin && <DropdownMenuSeparator />}
            <DropdownMenuItem 
              onClick={onLogout}
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
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
          
          {/* Keep visible login button on larger screens */}
          <Link to="/login" className="hidden sm:inline-flex">
            <Button className="inline-flex items-center h-9 px-3">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
        </>
      )}
    </>
  );
}
