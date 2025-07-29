import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Ban, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminSettings } from "@/components/dashboard/AdminSettings";
import { AdminSignupSettings } from "@/components/dashboard/AdminSignupSettings";
import { SiteStatusManager } from "@/components/dashboard/SiteStatusManager";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminUser {
  id: string;
  created_at: string;
  email?: string;
  full_name?: string;
  username?: string;
}

export function AdminUsersTabContent() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      
      // Get admin users first
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, created_at')
        .order('created_at', { ascending: false });

      if (adminError) {
        console.error('Error fetching admin users:', adminError);
        toast({
          title: "Error",
          description: "Failed to fetch admin users",
          variant: "destructive",
        });
        return;
      }

      if (!adminData || adminData.length === 0) {
        setAdminUsers([]);
        return;
      }

      // Get user profiles for these admin users
      const adminIds = adminData.map(admin => admin.id);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, email, full_name, username')
        .in('user_id', adminIds);

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
        // Continue with admin data without profile info
        const transformedData = adminData.map(admin => ({
          id: admin.id,
          created_at: admin.created_at,
          email: `admin-${admin.id.substring(0, 6)}@unknown.com`,
          full_name: 'Unknown Admin',
          username: 'Unknown Admin',
        }));
        setAdminUsers(transformedData);
        return;
      }

      // Create a map of profiles by user_id
      const profileMap = new Map();
      if (profileData) {
        profileData.forEach(profile => {
          profileMap.set(profile.user_id, profile);
        });
      }

      // Transform the data to combine admin and profile info
      const transformedData = adminData.map(admin => {
        const profile = profileMap.get(admin.id);
        return {
          id: admin.id,
          created_at: admin.created_at,
          email: profile?.email || `admin-${admin.id.substring(0, 6)}@unknown.com`,
          full_name: profile?.full_name || 'Unknown Admin',
          username: profile?.username || 'Unknown Admin',
        };
      });

      setAdminUsers(transformedData);
    } catch (error) {
      console.error('Error in fetchAdminUsers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId);

      if (error) {
        console.error('Error removing admin:', error);
        toast({
          title: "Error",
          description: "Failed to remove admin privileges",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Admin privileges removed successfully",
      });

      // Refresh the list
      fetchAdminUsers();
    } catch (error) {
      console.error('Error in handleRemoveAdmin:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin privileges",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      // First check if user_status exists
      const { data: existingStatus } = await supabase
        .from('user_status')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingStatus) {
        // Update existing status
        const { error } = await supabase
          .from('user_status')
          .update({ banned: true })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new status
        const { error } = await supabase
          .from('user_status')
          .insert({ user_id: userId, banned: true });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "User has been banned",
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <TabsContent value="admin-users" className="space-y-4">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-xl font-semibold text-white">Admin Settings</h2>
        </div>
        <div className="text-center py-8 text-gray-400">Loading admin settings...</div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="admin-users" className="space-y-4">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold text-white">Admin Settings</h2>
      </div>
      
      {/* Admin Settings Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AdminSettings />
        <AdminSignupSettings />
      </div>
      
      {/* Site Status Manager */}
      <div className="mb-6">
        <SiteStatusManager />
      </div>
      
      {/* Admin Users Management Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Admin Users Management
          </h3>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            <Shield className="w-3 h-3 mr-1" />
            {adminUsers.length} Admin{adminUsers.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {adminUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <User className="mx-auto h-12 w-12 mb-4" />
            <p>No admin users found</p>
          </div>
        ) : (
          <div className="bg-[#1E1B31] rounded-lg border border-gray-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Full Name</TableHead>
                  <TableHead className="text-gray-300">Username</TableHead>
                  <TableHead className="text-gray-300">Created At</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((admin) => (
                  <TableRow 
                    key={admin.id} 
                    className="border-gray-800 hover:bg-gray-800/30"
                  >
                    <TableCell className="text-white">
                      {admin.email || 'No email'}
                    </TableCell>
                    <TableCell className="text-white">
                      {admin.full_name || 'No name'}
                    </TableCell>
                    <TableCell className="text-white">
                      {admin.username || 'No username'}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            Ban
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1E1B31] border-gray-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Ban User</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to ban this user? This will prevent them from accessing the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleBanUser(admin.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Ban User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1E1B31] border-gray-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Remove Admin Privileges</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Are you sure you want to remove admin privileges from this user? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveAdmin(admin.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Admin
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </TabsContent>
  );
}