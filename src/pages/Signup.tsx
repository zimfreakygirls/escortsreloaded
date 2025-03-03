
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
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Generate a temporary email using the username
      const tempEmail = `${values.username.toLowerCase()}@escortsreloaded.com`;
      
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: values.password,
        options: {
          data: {
            username: values.username,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a]">
      <div className="w-full max-w-md space-y-8 p-8 bg-[#292741]/90 backdrop-blur-lg rounded-xl shadow-2xl border border-[#9b87f5]/20">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <div className="text-4xl font-bold flex items-center">
              <span className="text-pink-500">❤</span>
              <span className="bg-gradient-to-r from-[#ff719A] to-[#f97316] bg-clip-text text-transparent">OneNight</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Join our community and find your perfect match
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Username"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
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
          Already have an account?{" "}
          <Link to="/login" className="text-[#9b87f5] hover:text-[#8b77e5] transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
