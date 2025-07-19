
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
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session found");
      }
      
      // First, sign out to ensure clean state
      await supabase.auth.signOut();
      
      // Create new admin account with new credentials
      const newEmail = `${values.newUsername.toLowerCase()}@escortsreloaded.com`;
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: newEmail,
        password: values.newPassword,
      });
      
      if (signupError) throw signupError;
      
      if (signupData?.user) {
        // Add to admin_users table
        await supabase.from('admin_users').insert({ id: signupData.user.id });
        
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
    <Card className="border-[#9b87f5]/30 bg-gradient-to-br from-[#292741]/80 to-[#1e1c2e]/80 backdrop-blur-md shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
          Admin Credentials
        </CardTitle>
        <CardDescription className="text-gray-400">
          Update your administrator username and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">New Admin Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">New Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Credentials"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
