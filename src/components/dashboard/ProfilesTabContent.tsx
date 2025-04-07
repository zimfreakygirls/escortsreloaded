
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfilesTable } from "@/components/dashboard/ProfilesTable";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface ProfilesTabContentProps {
  profiles: any[];
  onProfileCreated: () => void;
  currencySymbol: string;
}

export function ProfilesTabContent({ profiles, onProfileCreated, currencySymbol }: ProfilesTabContentProps) {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { toast } = useToast();

  const handleDeleteProfile = async () => {
    onProfileCreated();
  };

  const handleProfileCreated = () => {
    setShowProfileForm(false);
    onProfileCreated();
    toast({
      title: "Success",
      description: "Profile created successfully",
    });
  };

  return (
    <TabsContent value="profiles" className="space-y-4">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold">Manage Profiles</h2>
        <Button 
          onClick={() => setShowProfileForm(true)}
          className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Add New Profile</span>
        </Button>
      </div>
      
      <ProfilesTable 
        profiles={profiles} 
        onDelete={handleDeleteProfile} 
        currencySymbol={currencySymbol}
      />
      
      <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
        <DialogContent className="bg-[#292741] border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Profile</DialogTitle>
          </DialogHeader>
          <ProfileForm onSuccess={handleProfileCreated} />
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
