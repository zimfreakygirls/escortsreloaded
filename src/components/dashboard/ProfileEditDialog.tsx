
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  is_verified?: boolean;
  is_premium?: boolean;
}

interface ProfileEditDialogProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProfileEditDialog({ profile, isOpen, onClose, onSuccess }: ProfileEditDialogProps) {
  const { toast } = useToast();
  const [editForm, setEditForm] = useState<Partial<Profile>>({
    is_verified: false,
    is_premium: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when profile changes
  useState(() => {
    if (profile) {
      setEditForm({
        name: profile.name,
        age: profile.age,
        location: profile.location,
        city: profile.city,
        country: profile.country,
        price_per_hour: profile.price_per_hour,
        phone: profile.phone || "",
        video_url: profile.video_url || "",
        is_verified: !!profile.is_verified,
        is_premium: !!profile.is_premium,
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setEditForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm((prev) => ({
      ...prev,
      [name]: checked === true,
    }));
  };

  const handleClose = () => {
    setEditForm({
      is_verified: false,
      is_premium: false,
    });
    setIsSaving(false);
    onClose();
  };

  const saveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);

    try {
      const requiredFields = [
        'name',
        'age',
        'location',
        'city',
        'country',
        'price_per_hour'
      ];
      for (let k of requiredFields) {
        // @ts-ignore
        if (!editForm[k] && editForm[k] !== 0) {
          throw new Error(`Required field '${k}' is missing`);
        }
      }

      const updatedProfile = {
        name: editForm.name,
        age: editForm.age,
        location: editForm.location,
        city: editForm.city,
        country: editForm.country,
        price_per_hour: editForm.price_per_hour,
        phone: editForm.phone?.toString().trim() ? editForm.phone : null,
        video_url: editForm.video_url?.toString().trim() ? editForm.video_url : null,
        is_verified: !!editForm.is_verified,
        is_premium: !!editForm.is_premium,
      };

      console.log("[Update] Saving profile:", updatedProfile);

      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error?.message || String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="bg-[#292741] border-gray-800 text-white max-w-md"
        aria-describedby="dialog-description-edit-profile"
      >
        <DialogHeader>
          <DialogTitle>Edit Profile: {profile.name}</DialogTitle>
          <span className="sr-only" id="dialog-description-edit-profile">
            Edit the profile details, including premium and verified status. 
          </span>
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
              <label className="text-sm text-gray-300">Video URL (Telegram or direct video)</label>
              <Input 
                name="video_url"
                value={editForm.video_url || ''}
                onChange={handleInputChange}
                className="bg-[#1e1c2e] border-gray-700"
                placeholder="https://t.me/username/123 or video URL"
              />
              <p className="text-xs text-gray-400 mt-1">
                For Telegram videos, use format: https://t.me/username/123
              </p>
            </div>

            <div className="col-span-2 space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_verified" 
                  checked={!!editForm.is_verified}
                  onCheckedChange={(checked: boolean | "indeterminate") => handleCheckboxChange("is_verified", checked === true)}
                  className={!!editForm.is_verified ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600" : ""}
                />
                <label htmlFor="is_verified" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Verified Profile
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_premium" 
                  checked={!!editForm.is_premium}
                  onCheckedChange={(checked: boolean | "indeterminate") => handleCheckboxChange("is_premium", checked === true)}
                  className={!!editForm.is_premium ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600" : ""}
                />
                <label htmlFor="is_premium" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Premium Profile
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-700 hover:bg-gray-800"
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={saveProfile}
            className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
            disabled={isSaving}
          >
            <Check className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
