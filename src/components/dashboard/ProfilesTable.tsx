
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
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

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  country: string;
  price_per_hour: number;
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

  return (
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProfile(profile.id)}
                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
