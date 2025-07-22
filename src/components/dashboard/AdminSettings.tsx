
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  newUsername: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newUsername: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Get the current session and user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error("No active session found");
      }
      
      const currentUserId = sessionData.session.user.id;
      
      // Create new admin account with new credentials
      const newEmail = `${values.newUsername.toLowerCase()}@escortsreloaded.com`;
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: newEmail,
        password: values.newPassword,
      });
      
      if (signupError) throw signupError;
      
      if (signupData?.user) {
        // Add new admin to admin_users table
        await supabase.from('admin_users').insert({ id: signupData.user.id });
        
        // Remove old admin from admin_users table
        await supabase.from('admin_users').delete().eq('id', currentUserId);
        
        // Sign out current session
        await supabase.auth.signOut();
        
        // Sign in with new credentials
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: newEmail,
          password: values.newPassword,
        });
        
        if (loginError) throw loginError;
      }
      
      toast({
        title: "Settings updated",
        description: "Your admin credentials have been updated successfully.",
      });
      
      // Reset the form
      form.reset();
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
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-[#9b87f5]/30 bg-gradient-to-br from-[#292741]/80 to-[#1e1c2e]/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
            Admin Credentials
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm sm:text-base">
            Update your administrator username and password securely
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="newUsername"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300 text-sm font-medium">
                        New Admin Username
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter new username"
                          className="h-11 bg-[#1e1c2e]/80 border-[#9b87f5]/30 focus-visible:ring-2 focus-visible:ring-[#9b87f5]/50 focus-visible:border-[#9b87f5] text-white placeholder:text-gray-500 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-300 text-sm font-medium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Min. 6 characters"
                            className="h-11 bg-[#1e1c2e]/80 border-[#9b87f5]/30 focus-visible:ring-2 focus-visible:ring-[#9b87f5]/50 focus-visible:border-[#9b87f5] text-white placeholder:text-gray-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-300 text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="Repeat password"
                            className="h-11 bg-[#1e1c2e]/80 border-[#9b87f5]/30 focus-visible:ring-2 focus-visible:ring-[#9b87f5]/50 focus-visible:border-[#9b87f5] text-white placeholder:text-gray-500 transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-sm sm:text-base">Updating Credentials...</span>
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base">Update Admin Credentials</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
