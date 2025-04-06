
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Ban, CheckCircle, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "../ui/switch";
import { AnimationWrapper } from "../ui/animation-wrapper";
import { Badge } from "../ui/badge";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned: boolean;
  approved: boolean;
}

// Define interfaces for our user status data
interface UserStatus {
  id: string;
  user_id: string;
  banned: boolean;
  approved: boolean;
  created_at: string;
}

export function UsersTable() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Instead of using admin.listUsers(), we'll get users from the auth.users view
      // This requires setting up a view in Supabase that's accessible with the anon key
      
      // Get user_status data from our custom table
      const { data: userStatusRaw, error: statusError } = await supabase
        .from('user_status')
        .select('*');
        
      if (statusError) throw statusError;
      
      // Create a map of user statuses
      const statusMap: Record<string, { banned: boolean, approved: boolean }> = {};
      if (userStatusRaw) {
        // Cast to our expected type
        const userStatus = userStatusRaw as UserStatus[];
        userStatus.forEach(status => {
          statusMap[status.user_id] = {
            banned: status.banned || false,
            approved: status.approved || false
          };
        });
      }
      
      // For now, we'll use a temporary solution with some mock users
      // In a real app, you would implement a backend function to list users
      const mockUsers = [
        {
          id: "1",
          email: "admin@escortsreloaded.com",
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          banned: false,
          approved: true
        },
        {
          id: "2",
          email: "user@example.com",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_sign_in_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          banned: statusMap["2"]?.banned || false,
          approved: statusMap["2"]?.approved || false
        }
      ];
      
      // Find any users in user_status that aren't in our mock list and add them
      Object.keys(statusMap).forEach(userId => {
        if (!mockUsers.find(u => u.id === userId)) {
          mockUsers.push({
            id: userId,
            email: `user-${userId.substring(0, 6)}@example.com`,
            created_at: new Date().toISOString(),
            last_sign_in_at: null,
            banned: statusMap[userId].banned,
            approved: statusMap[userId].approved
          });
        }
      });
      
      setUsers(mockUsers);
      
      toast({
        title: "Note",
        description: "Displaying sample users. To view actual users, you need a server component with service role access.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, field: 'banned' | 'approved', value: boolean) => {
    try {
      // Check if user already has an entry in user_status
      const { data: existingStatus } = await supabase
        .from('user_status')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      let result;
      
      if (existingStatus) {
        // Update existing record
        result = await supabase
          .from('user_status')
          .update({ [field]: value })
          .eq('user_id', userId);
      } else {
        // Create new record
        const insertData = { 
          user_id: userId, 
          [field]: value,
          ...(field === 'banned' ? { approved: false } : { banned: false })
        };
        
        result = await supabase
          .from('user_status')
          .insert([insertData]); // Wrap in array to match expected type
      }
      
      if (result.error) throw result.error;
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, [field]: value } 
            : user
        )
      );
      
      toast({
        title: "Success",
        description: `User ${field === 'banned' ? (value ? 'banned' : 'unbanned') : (value ? 'approved' : 'unapproved')} successfully`,
      });
    } catch (error: any) {
      console.error(`Error toggling user ${field}:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to update user status`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-[#9b87f5] rounded-full"></div>
      </div>
    );
  }

  return (
    <AnimationWrapper animation="fade" duration={0.5} className="space-y-6">
      <div className="rounded-md border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1e1c2e]">
            <TableRow className="hover:bg-transparent border-gray-800">
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Created At</TableHead>
              <TableHead className="text-gray-300">Last Sign In</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-gray-800 hover:bg-[#1e1c2e]/30">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-gray-300">{formatDate(user.last_sign_in_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.banned && (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                          Banned
                        </Badge>
                      )}
                      {user.approved && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 border-green-700">
                          Approved
                        </Badge>
                      )}
                      {!user.banned && !user.approved && (
                        <Badge variant="outline" className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300 border-gray-700">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`approve-${user.id}`}
                          checked={user.approved}
                          onCheckedChange={(checked) => toggleUserStatus(user.id, 'approved', checked)}
                          className={user.approved ? "bg-green-500" : ""}
                        />
                        <label htmlFor={`approve-${user.id}`} className="text-sm font-medium">
                          {user.approved ? "Approved" : "Approve"}
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`ban-${user.id}`}
                          checked={user.banned}
                          onCheckedChange={(checked) => toggleUserStatus(user.id, 'banned', checked)}
                          className={user.banned ? "bg-red-500" : ""}
                        />
                        <label htmlFor={`ban-${user.id}`} className="text-sm font-medium">
                          {user.banned ? "Banned" : "Ban"}
                        </label>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AnimationWrapper>
  );
}
