
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
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking existing session...");
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session found, checking admin status...");
          const isAdmin = await checkIsAdmin(data.session.user.id);
          if (isAdmin) {
            console.log("User is admin, redirecting to dashboard");
            navigate('/dashboard');
            return;
          }
        }
        console.log("No valid admin session found");
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Starting login process...");
      
      if (username === "Mcdchiez16" && password === "mcdonald2001@") {
        const email = 'admin@escortsreloaded.com';
        
        console.log("Attempting admin login with:", { email });

        // Sign out first to ensure clean state
        await supabase.auth.signOut();
        const supabasePassword = "Mcdchiez16Admin2024!"; 

        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password: supabasePassword,
        });

        if (loginError) {
          console.log("Login failed, attempting signup:", loginError.message);
          
          if (loginError.message.includes("Invalid login credentials")) {
            const { data: signupData, error: signupError } = await supabase.auth.signUp({
              email,
              password: supabasePassword,
            });
            
            if (signupError) throw signupError;
            
            if (signupData?.user) {
              console.log("User created, adding to admin_users...");
              await supabase.from('admin_users').insert({ id: signupData.user.id });
              
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password: supabasePassword,
              });
              
              if (retryError) throw retryError;
              
              console.log("Admin login successful after signup");
            }
          } else {
            throw loginError;
          }
        } else {
          console.log("Admin login successful");
          
          // Ensure user is in admin_users table
          const isAdmin = await checkIsAdmin(loginData.user.id);
          if (!isAdmin) {
            console.log("Adding user to admin_users table...");
            await supabase.from('admin_users').insert({ id: loginData.user.id });
          }
        }

        toast({
          title: "Success!",
          description: "You have been logged in as administrator.",
        });

        navigate("/dashboard");
      } else {
        // Handle other admin users
        const email = `${username.toLowerCase()}@escortsreloaded.com`;
        
        console.log("Attempting custom admin login with:", { email });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        const isAdmin = await checkIsAdmin(data.user.id);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          throw new Error("You do not have administrative privileges.");
        }

        toast({
          title: "Success!",
          description: "You have been logged in as administrator.",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a]">
        <div className="animate-spin h-12 w-12 border-t-2 border-[#9b87f5] rounded-full"></div>
      </div>
    );
  }

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
