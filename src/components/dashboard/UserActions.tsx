
import { useState } from "react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
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
} from "../ui/alert-dialog";

interface UserActionsProps {
  userId: string;
  banned: boolean;
  approved: boolean;
  onStatusChange: (userId: string, field: 'banned' | 'approved', value: boolean) => void;
  onUserDeleted?: (userId: string) => void;
}

export function UserActions({ userId, banned, approved, onStatusChange, onUserDeleted }: UserActionsProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const toggleUserStatus = async (field: 'banned' | 'approved', value: boolean) => {
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
      
      // Call the parent component's callback to update local state
      onStatusChange(userId, field, value);
      
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

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      // Use the secure admin edge function to delete user completely
      const { error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.message || 'Failed to delete user');
      }

      toast({
        title: "User Deleted",
        description: "User has been permanently deleted from the system",
      });

      // Call the callback to update parent component
      if (onUserDeleted) {
        onUserDeleted(userId);
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          id={`approve-${userId}`}
          checked={approved}
          onCheckedChange={(checked) => toggleUserStatus('approved', checked)}
          className={approved ? "bg-green-500" : ""}
        />
        <label htmlFor={`approve-${userId}`} className="text-sm font-medium">
          {approved ? "Approved" : "Approve"}
        </label>
      </div>
      
      <div className="flex items-center gap-2">
        <Switch
          id={`ban-${userId}`}
          checked={banned}
          onCheckedChange={(checked) => toggleUserStatus('banned', checked)}
          className={banned ? "bg-red-500" : ""}
        />
        <label htmlFor={`ban-${userId}`} className="text-sm font-medium">
          {banned ? "Banned" : "Ban"}
        </label>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            disabled={isDeleting}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#1E1B31] border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to permanently delete this user? This action cannot be undone and will remove all user data including profiles and payment records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
