
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimationWrapper } from "../ui/animation-wrapper";
import { UserTableRow } from "./UserTableRow";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned: boolean;
  approved: boolean;
}

export function UsersTable() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get actual users from the auth.users table via a function or API
      const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        // If we can't access auth.users (common with anon key), inform the user
        console.error("Cannot access user list with current permissions:", usersError);
        toast({
          title: "Limited Access",
          description: "Only showing users with status information. Full user list requires admin access.",
          variant: "default",
        });
        
        // Fetch user status records only, as this is accessible with anon key
        const { data: userStatusData, error: statusError } = await supabase
          .from('user_status')
          .select('*');
          
        if (statusError) throw statusError;
        
        // Create user records from status data
        if (userStatusData && userStatusData.length > 0) {
          const usersFromStatus = userStatusData.map(status => ({
            id: status.user_id,
            email: `user-${status.user_id.substring(0, 6)}@example.com`, // Email unknown from status
            created_at: status.created_at || new Date().toISOString(),
            last_sign_in_at: null,
            banned: status.banned,
            approved: status.approved
          }));
          
          setUsers(usersFromStatus);
        } else {
          // Show at least admin user for demo
          setUsers([{
            id: "1",
            email: "admin@escortsreloaded.com",
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            banned: false,
            approved: true
          }]);
          
          toast({
            title: "Note",
            description: "No user records found. This may require admin API access or users to be created.",
            variant: "default",
          });
        }
      } else if (authUsers) {
        // Successfully got auth users (unlikely with anon key)
        const usersList = authUsers.users.map(user => {
          return {
            id: user.id,
            email: user.email || `user-${user.id.substring(0, 6)}@example.com`,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            banned: false,
            approved: false
          };
        });
        
        // Now fetch user status to merge with auth users
        const { data: userStatusData } = await supabase
          .from('user_status')
          .select('*');
          
        // Create a map of user statuses
        const statusMap: Record<string, { banned: boolean, approved: boolean }> = {};
        if (userStatusData) {
          userStatusData.forEach(status => {
            statusMap[status.user_id] = {
              banned: status.banned || false,
              approved: status.approved || false
            };
          });
        }
        
        // Merge status data with users
        const mergedUsers = usersList.map(user => ({
          ...user,
          banned: statusMap[user.id]?.banned || false,
          approved: statusMap[user.id]?.approved || false
        }));
        
        setUsers(mergedUsers);
      }
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

  const handleStatusChange = async (userId: string, field: 'banned' | 'approved', value: boolean) => {
    try {
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, [field]: value } 
            : user
        )
      );
    } catch (error: any) {
      console.error(`Error updating user status:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
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
                <UserTableRow 
                  key={user.id}
                  user={user}
                  formatDate={formatDate}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AnimationWrapper>
  );
}
