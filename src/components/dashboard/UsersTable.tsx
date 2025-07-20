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
  username?: string;
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
      
      // Get user profiles from our new user_profiles table
      const { data: userProfilesData, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (userProfilesError) {
        console.error('Error fetching user profiles:', userProfilesError);
        toast({
          title: "Error",
          description: "Failed to load user profiles",
          variant: "destructive",
        });
        return;
      }

      const mappedUsers = (userProfilesData || []).map(profile => ({
        id: profile.user_id,
        email: profile.email || `user-${profile.user_id.substring(0, 6)}@unknown.com`,
        username: profile.username || profile.full_name || profile.email?.split('@')[0] || 'Unknown User',
        created_at: profile.created_at,
        last_sign_in_at: null, // We don't have this info in user_profiles
        banned: false,
        approved: false
      }));

      // Get user_status for banned/approved info
      const { data: userStatusData } = await supabase
        .from('user_status')
        .select('*');
        
      if (userStatusData && userStatusData.length > 0) {
        const statusMap = new Map();
        userStatusData.forEach(status => {
          statusMap.set(status.user_id, status);
        });
        
        mappedUsers.forEach(user => {
          const status = statusMap.get(user.id);
          if (status) {
            user.banned = status.banned;
            user.approved = status.approved;
          }
        });
      }

      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
      
      setUsers([]);
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
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4 p-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No users found
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-[#1e1c2e] rounded-lg p-4 border border-gray-800">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-white text-lg">
                      {user.username || 'Unknown User'}
                    </h3>
                    <p className="text-gray-300 text-sm break-all">{user.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Created:</span> {formatDate(user.created_at)}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Last Sign In:</span> {formatDate(user.last_sign_in_at)}
                    </div>
                  </div>
                  
                  <UserTableRow 
                    user={user}
                    formatDate={formatDate}
                    onStatusChange={handleStatusChange}
                    isMobile={true}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1e1c2e]">
              <TableRow className="hover:bg-transparent border-gray-800">
                <TableHead className="text-gray-300 whitespace-nowrap">User</TableHead>
                <TableHead className="text-gray-300 whitespace-nowrap">Created At</TableHead>
                <TableHead className="text-gray-300 whitespace-nowrap">Last Sign In</TableHead>
                <TableHead className="text-gray-300 whitespace-nowrap">Status</TableHead>
                <TableHead className="text-gray-300 whitespace-nowrap">Actions</TableHead>
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
      </div>
    </AnimationWrapper>
  );
}
