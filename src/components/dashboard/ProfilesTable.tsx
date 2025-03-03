
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2, BadgeCheck, Crown, Edit, Check, X } from "lucide-react";
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
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

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
  onDelete: () => void;
  currencySymbol?: string;
}

export function ProfilesTable({ profiles, onDelete, currencySymbol = '$' }: ProfilesTableProps) {
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  const deleteProfile = async (id: string) => {
    try {
      const profile = profiles.find(p => p.id === id);
      
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
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${!currentStatus ? "verified" : "unverified"} successfully`,
      });

      onDelete(); // Refresh the profiles list
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePremiumStatus = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${!currentStatus ? "set as premium" : "removed from premium"} successfully`,
      });

      onDelete(); // Refresh the profiles list
    } catch (error: any) {
      console.error('Premium status error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    setEditForm({
      name: profile.name,
      age: profile.age,
      location: profile.location,
      city: profile.city,
      country: profile.country,
      price_per_hour: profile.price_per_hour,
      phone: profile.phone || '',
      video_url: profile.video_url || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric fields properly
    if (type === 'number') {
      setEditForm({
        ...editForm,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const saveProfile = async () => {
    if (!editingProfile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          age: editForm.age,
          location: editForm.location,
          city: editForm.city,
          country: editForm.country,
          price_per_hour: editForm.price_per_hour,
          phone: editForm.phone || null,
          video_url: editForm.video_url || null,
        })
        .eq('id', editingProfile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setEditingProfile(null);
      onDelete(); // Refresh the profiles list
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
            {profiles.map((profile) => (
              <TableRow key={profile.id} className="border-gray-800 hover:bg-[#1e1c2e]/30">
                <TableCell className="font-medium text-white">{profile.name}</TableCell>
                <TableCell className="text-gray-300">{profile.age}</TableCell>
                <TableCell className="text-gray-300">{profile.location}</TableCell>
                <TableCell className="text-gray-300">{profile.city}</TableCell>
                <TableCell className="text-gray-300">{profile.country}</TableCell>
                <TableCell className="text-gray-300">{currencySymbol}{profile.price_per_hour}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVerificationStatus(profile.id, !!profile.is_verified)}
                      className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full ${
                        profile.is_verified 
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 hover:bg-blue-600" 
                          : "bg-gray-700/20 text-gray-400 border-gray-600 hover:bg-gray-700/30 hover:text-gray-300"
                      }`}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      {profile.is_verified ? "Verified" : "Verify"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePremiumStatus(profile.id, !!profile.is_premium)}
                      className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full ${
                        profile.is_premium 
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 hover:bg-amber-600" 
                          : "bg-gray-700/20 text-gray-400 border-gray-600 hover:bg-gray-700/30 hover:text-gray-300"
                      }`}
                    >
                      <Crown className="h-4 w-4" />
                      {profile.is_premium ? "Premium" : "Make Premium"}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(profile)}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProfile(profile.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Profile Dialog */}
      {editingProfile && (
        <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
          <DialogContent className="bg-[#292741] border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile: {editingProfile.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Name</label>
                  <Input 
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Age</label>
                  <Input 
                    name="age"
                    type="number"
                    value={editForm.age || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Location</label>
                  <Input 
                    name="location"
                    value={editForm.location || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">City</label>
                  <Input 
                    name="city"
                    value={editForm.city || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Country</label>
                  <Input 
                    name="country"
                    value={editForm.country || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Price per hour</label>
                  <Input 
                    name="price_per_hour"
                    type="number"
                    value={editForm.price_per_hour || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <label className="text-sm text-gray-300">Phone</label>
                  <Input 
                    name="phone"
                    value={editForm.phone || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <label className="text-sm text-gray-300">Video URL</label>
                  <Input 
                    name="video_url"
                    value={editForm.video_url || ''}
                    onChange={handleInputChange}
                    className="bg-[#1e1c2e] border-gray-700"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditingProfile(null)}
                className="border-gray-700 hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={saveProfile}
                className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
