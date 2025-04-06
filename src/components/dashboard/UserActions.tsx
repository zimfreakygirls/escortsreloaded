
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserActionsProps {
  userId: string;
  banned: boolean;
  approved: boolean;
  onStatusChange: (userId: string, field: 'banned' | 'approved', value: boolean) => void;
}

export function UserActions({ userId, banned, approved, onStatusChange }: UserActionsProps) {
  const { toast } = useToast();
  
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
    </div>
  );
}
