
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  onSuccess: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    city: "",
    country: "",
    price_per_hour: "",
    phone: "",
    video_url: "",
  });
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
    }
  };

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    try {
      // Check if bucket exists and create it if it doesn't
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('profile-images');

      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('profile-images', {
          public: true,
          fileSizeLimit: 5242880
        });
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      return uploadedUrls;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload images: ' + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedImages) {
        throw new Error("Please select at least one image");
      }

      // Make sure country is properly capitalized for consistent filtering
      const countryName = formData.country.trim();
      const formattedCountry = countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase();

      const imageUrls = await uploadImages(selectedImages);

      const { data, error } = await supabase.from('profiles').insert({
        name: formData.name,
        age: parseInt(formData.age),
        location: formData.location,
        city: formData.city,
        country: formattedCountry, // Use formatted country name for consistency
        price_per_hour: parseInt(formData.price_per_hour),
        phone: formData.phone || null,
        video_url: formData.video_url || null,
        images: imageUrls,
      }).select();

      if (error) {
        throw error;
      }

      // Check if country exists in the countries table
      const { data: countryExists, error: countryCheckError } = await supabase
        .from('countries')
        .select('id')
        .eq('name', formattedCountry)
        .single();

      // If country doesn't exist, add it to the countries table
      if (countryCheckError && countryCheckError.code === 'PGRST116') {
        await supabase.from('countries').insert({
          name: formattedCountry,
          active: true
        });
      }

      toast({
        title: "Success",
        description: "Profile created successfully",
      });

      setFormData({
        name: "",
        age: "",
        location: "",
        city: "",
        country: "",
        price_per_hour: "",
        phone: "",
        video_url: "",
      });
      setSelectedImages(null);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
        <Input
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
          required
        />
        <Input
          name="price_per_hour"
          type="number"
          placeholder="Price per hour"
          value={formData.price_per_hour}
          onChange={handleInputChange}
          required
        />
        <Input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <Input
          name="video_url"
          placeholder="Video URL"
          value={formData.video_url}
          onChange={handleInputChange}
        />
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create Profile
          </>
        )}
      </Button>
    </form>
  );
}
