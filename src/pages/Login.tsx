
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const checkUserApprovalStatus = async (userId: string): Promise<boolean> => {
    setIsCheckingStatus(true);
    try {
      const { data, error } = await supabase
        .from('user_status')
        .select('approved, banned')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error checking user status:', error);
        return false;
      }
      
      setIsCheckingStatus(false);
      
      if (data?.banned) {
        toast({
          title: "Account banned",
          description: "Your account has been banned. Please contact support for assistance.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!data?.approved) {
        toast({
          title: "Account not approved",
          description: "Your account is awaiting approval from an administrator.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in approval check:', error);
      setIsCheckingStatus(false);
      return false;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      // Check if the user is approved
      const isApproved = await checkUserApprovalStatus(data.user.id);
      
      if (!isApproved) {
        // Sign out the user if not approved
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      toast({
        title: "Logged in successfully!",
        description: "Welcome to Escorts Reloaded",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
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
            Log In
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Welcome back, log in to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white pl-4 h-12"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="password"
                          placeholder="Password"
                          className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white pl-4 h-12"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium"
              disabled={isLoading || isCheckingStatus}
            >
              {(isLoading || isCheckingStatus) ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCheckingStatus ? "Verifying account..." : "Logging in..."}
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative flex items-center justify-center mt-6">
          <div className="border-t border-gray-700 w-full"></div>
          <div className="bg-[#292741] px-4 text-sm text-gray-400 relative z-10">or</div>
          <div className="border-t border-gray-700 w-full"></div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-[#9b87f5] hover:text-[#8b77e5] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
