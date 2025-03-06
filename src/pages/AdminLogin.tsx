
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import { checkIsAdmin } from "@/utils/adminUtils";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as admin and redirect if true
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const isAdmin = await checkIsAdmin(data.session.user.id);
        if (isAdmin) {
          navigate('/dashboard');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hard-coded admin credentials check
      if (username === "admin" && password === "admin") {
        // Use a predefined admin email for Supabase Auth
        const email = 'admin@escortsreloaded.com';
        
        // For debugging purposes
        console.log("Attempting to sign in with:", { email, password: "admin123" });

        // Sign out any existing session first to ensure clean login
        await supabase.auth.signOut();

        // Sign in with email/password that's registered in Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: "admin123", // This needs to match what's set in your Supabase auth
        });

        if (error) {
          console.error("Login error:", error);
          throw error;
        }

        console.log("Login successful:", data);

        // Check if the user is an admin
        const isAdmin = await checkIsAdmin(data.user.id);
        
        if (!isAdmin) {
          // Sign out if not an admin
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You do not have administrative privileges.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Success!",
          description: "You have been logged in as administrator.",
        });

        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a]">
      <div className="w-full max-w-md space-y-8 p-8 bg-[#292741]/90 backdrop-blur-lg rounded-xl shadow-2xl border border-[#9b87f5]/20">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/0aa7311a-71fc-4de3-b931-de22dfc1c9a5.png" 
            alt="Logo" 
            className="w-20 h-20 object-contain mb-2"
          />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
            Admin Access
          </h2>
          <div className="mt-2 flex items-center justify-center text-center gap-2 text-gray-400">
            <ShieldAlert className="h-5 w-5 text-[#9b87f5]" />
            <p>Restricted Area - Administrator Login Only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <Input
                type="text"
                placeholder="Admin Username"
                className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white h-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Password"
                className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </div>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
