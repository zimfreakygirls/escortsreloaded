
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

interface Profile {
  id: string;
  name: string;
  age: number;
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
  currencySymbol: string;
}

export function ProfilesTable({ profiles, onDelete, currencySymbol }: ProfilesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
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
      toast({
        title: "Error",
        description: `Failed to delete profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(id);
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${!currentStatus ? 'verified' : 'unverified'} successfully`,
      });
      
      onDelete(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const togglePremium = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(id);
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile ${!currentStatus ? 'set as premium' : 'removed from premium'} successfully`,
      });
      
      onDelete(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="rounded-md border border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-800">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Location</TableHead>
            <TableHead className="text-white">Price</TableHead>
            <TableHead className="text-white">Verified</TableHead>
            <TableHead className="text-white">Premium</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                No profiles found
              </TableCell>
            </TableRow>
          ) : (
            profiles.map((profile) => (
              <TableRow key={profile.id} className="border-gray-800 hover:bg-gray-800/40">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={profile.images[0] || '/placeholder.svg'}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      {profile.name}, {profile.age}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{profile.city}, {profile.country}</TableCell>
                <TableCell className="text-gray-300">{currencySymbol}{profile.price_per_hour}</TableCell>
                <TableCell>
                  <Switch 
                    checked={profile.is_verified || false}
                    onCheckedChange={() => toggleVerified(profile.id, profile.is_verified || false)}
                    disabled={updating === profile.id}
                  />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={profile.is_premium || false}
                    onCheckedChange={() => togglePremium(profile.id, profile.is_premium || false)}
                    disabled={updating === profile.id}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-400 hover:text-blue-500 hover:bg-blue-900/20"
                      asChild
                    >
                      <a href={`/profile/${profile.id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === profile.id}
                      onClick={() => handleDelete(profile.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
