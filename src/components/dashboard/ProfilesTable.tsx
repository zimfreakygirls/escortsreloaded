import { useState, useEffect } from "react";
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
import { ProfileStatusButtons } from "./ProfileStatusButtons";
import { ProfileActionButtons } from "./ProfileActionButtons";
import { ProfileEditDialog } from "./ProfileEditDialog";

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  country: string;
  price_per_hour: number;
  phone?: string;
  video_url?: string;
  images: string[];
  is_verified?: boolean;
  is_premium?: boolean;
}

interface ProfilesTableProps {
  profiles: Profile[];
  onDelete: () => void; // Actually a reload
  currencySymbol?: string;
}

export function ProfilesTable({ profiles: propProfiles, onDelete, currencySymbol = '$' }: ProfilesTableProps) {
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(propProfiles);

  // Keep localProfiles up-to-date with input props
  useEffect(() => {
    setLocalProfiles(propProfiles);
  }, [propProfiles]);

  const deleteProfile = async (id: string) => {
    try {
      const profile = localProfiles.find(p => p.id === id);

      if (profile) {
        // Delete images from storage
        for (const imageUrl of profile.images) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('profile-images')
              .remove([fileName]);
          }
        }
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });

      // Optimistically remove from UI
      setLocalProfiles(localProfiles => localProfiles.filter(p => p.id !== id));

      // Also call onDelete for parent to refetch from db
      onDelete();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleVerificationStatus = async (profileId: string, currentStatus: boolean) => {
    const statusKey = `verify-${profileId}`;
    setUpdatingStatus(statusKey);

    try {
      const newStatus = !currentStatus;
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_verified: newStatus })
        .eq('id', profileId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${newStatus ? "verified" : "unverified"} successfully`,
      });

      // Always trigger parent refresh for backend truth (with new RLS this will work!)
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update verification status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const togglePremiumStatus = async (profileId: string, currentStatus: boolean) => {
    const statusKey = `premium-${profileId}`;
    setUpdatingStatus(statusKey);

    try {
      const newStatus = !currentStatus;
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: newStatus })
        .eq('id', profileId)
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${newStatus ? "set as premium" : "removed from premium"} successfully`,
      });

      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update premium status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const closeEditDialog = () => {
    setEditingProfile(null);
  };

  return (
    <>
      <div className="rounded-md border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1e1c2e]">
            <TableRow className="hover:bg-transparent border-gray-800">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Age</TableHead>
              <TableHead className="text-gray-300">Location</TableHead>
              <TableHead className="text-gray-300">City</TableHead>
              <TableHead className="text-gray-300">Country</TableHead>
              <TableHead className="text-gray-300">Price/Hour</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localProfiles.map((profile) => (
              <TableRow key={profile.id} className="border-gray-800 hover:bg-[#1e1c2e]/30">
                <TableCell className="font-medium text-white">{profile.name}</TableCell>
                <TableCell className="text-gray-300">{profile.age}</TableCell>
                <TableCell className="text-gray-300">{profile.location}</TableCell>
                <TableCell className="text-gray-300">{profile.city}</TableCell>
                <TableCell className="text-gray-300">{profile.country}</TableCell>
                <TableCell className="text-gray-300">{currencySymbol}{profile.price_per_hour}</TableCell>
                <TableCell>
                  <ProfileStatusButtons
                    profileId={profile.id}
                    isVerified={!!profile.is_verified}
                    isPremium={!!profile.is_premium}
                    updatingStatus={updatingStatus}
                    onToggleVerification={toggleVerificationStatus}
                    onTogglePremium={togglePremiumStatus}
                  />
                </TableCell>
                <TableCell>
                  <ProfileActionButtons
                    onEdit={() => openEditDialog(profile)}
                    onDelete={() => deleteProfile(profile.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProfileEditDialog
        profile={editingProfile}
        isOpen={!!editingProfile}
        onClose={closeEditDialog}
        onSuccess={onDelete}
      />
    </>
  );
}
