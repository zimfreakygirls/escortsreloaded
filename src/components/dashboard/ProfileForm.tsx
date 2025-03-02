
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

interface ProfileFormProps {
  onSuccess: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      age: "",
      location: "",
      city: "",
      country: "",
      price_per_hour: "",
      phone: "",
      video_url: "",
      is_premium: false,
      is_verified: false,
    }
  });

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

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      if (!selectedImages) {
        throw new Error("Please select at least one image");
      }

      // Make sure country is properly capitalized for consistent filtering
      const countryName = data.country.trim();
      const formattedCountry = countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase();

      const imageUrls = await uploadImages(selectedImages);

      const { data: profileData, error } = await supabase.from('profiles').insert({
        name: data.name,
        age: parseInt(data.age),
        location: data.location,
        city: data.city,
        country: formattedCountry, // Use formatted country name for consistency
        price_per_hour: parseInt(data.price_per_hour),
        phone: data.phone || null,
        video_url: data.video_url || null,
        images: imageUrls,
        is_premium: data.is_premium || false,
        is_verified: data.is_verified || false,
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

      form.reset();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <Input
              {...form.register("name", { required: true })}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
            <Input
              {...form.register("age", { required: true })}
              type="number"
              placeholder="Age"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <Input
              {...form.register("location", { required: true })}
              placeholder="Location"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
            <Input
              {...form.register("city", { required: true })}
              placeholder="City"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <Input
              {...form.register("country", { required: true })}
              placeholder="Country"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price per hour</label>
            <Input
              {...form.register("price_per_hour", { required: true })}
              type="number"
              placeholder="Price per hour"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone number</label>
            <Input
              {...form.register("phone")}
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Video URL</label>
            <Input
              {...form.register("video_url")}
              placeholder="Video URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="is_premium"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white">Premium Profile</FormLabel>
                  <FormDescription className="text-gray-400">
                    Mark this profile as premium to feature it in premium listings.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_verified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white">Verified Profile</FormLabel>
                  <FormDescription className="text-gray-400">
                    Mark this profile as verified to indicate authenticity.
                  </FormDescription>
                </div>
              </FormItem>
            )}
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
    </Form>
  );
}
