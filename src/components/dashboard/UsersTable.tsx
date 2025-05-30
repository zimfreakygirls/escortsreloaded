
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
      
      // First attempt to get actual auth users via admin API
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsers?.users && authUsers.users.length > 0) {
        // If admin API works, map the user data
        const mappedUsers = authUsers.users.map(user => {
          return {
            id: user.id,
            email: user.email || `user-${user.id.substring(0, 6)}@example.com`,
            created_at: user.created_at || new Date().toISOString(),
            last_sign_in_at: user.last_sign_in_at,
            banned: false, // Will be updated from user_status
            approved: false // Will be updated from user_status
          };
        });
        
        // Get status data to merge with auth data
        const { data: userStatusData } = await supabase
          .from('user_status')
          .select('*');
          
        if (userStatusData && userStatusData.length > 0) {
          // Create a lookup map for quick access
          const statusMap = new Map();
          userStatusData.forEach(status => {
            statusMap.set(status.user_id, status);
          });
          
          // Update user data with status information
          mappedUsers.forEach(user => {
            const status = statusMap.get(user.id);
            if (status) {
              user.banned = status.banned;
              user.approved = status.approved;
            }
          });
        }
        
        setUsers(mappedUsers);
      } else {
        // Fallback to user_status table which is accessible with anon key
        const { data: userStatusData, error: statusError } = await supabase
          .from('user_status')
          .select('*');
          
        if (statusError) {
          throw statusError;
        }
        
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
          // If no status records, create at least one demo user for testing
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
            description: "No user records found. Create users or add entries to the user_status table.",
            variant: "default",
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
      
      // Fallback to show at least one user for demo purposes
      setUsers([{
        id: "1",
        email: "admin@escortsreloaded.com",
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        banned: false,
        approved: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = (userId: string, field: 'banned' | 'approved', value: boolean) => {
    // Update local state
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, [field]: value } 
          : user
      )
    );
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
