
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ProfileFormProps {
  onSuccess: () => void;
}

interface Country {
  id: string;
  name: string;
  currency: string;
  active: boolean;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        
        const { data: allCountries, error: allError } = await supabase
          .from('countries')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });
        
        if (allError) {
          console.error('Error fetching countries:', allError);
          throw allError;
        }

        if (!allCountries || allCountries.length === 0) {
          const defaultCountries = [
            { name: 'United States', currency: 'USD', active: true },
            { name: 'United Kingdom', currency: 'GBP', active: true },
            { name: 'Canada', currency: 'USD', active: true },
            { name: 'Australia', currency: 'USD', active: true },
            { name: 'Germany', currency: 'EUR', active: true },
            { name: 'France', currency: 'EUR', active: true },
            { name: 'Zambia', currency: 'ZMW', active: true },
            { name: 'South Africa', currency: 'USD', active: true },
          ];

          const { data: insertedCountries, error: insertError } = await supabase
            .from('countries')
            .insert(defaultCountries)
            .select();

          if (insertError) {
            throw insertError;
          }

          setCountries(insertedCountries || []);
        } else {
          setCountries(allCountries);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: "Error",
          description: "Failed to load countries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, [toast]);

  const handleCountryChange = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    setSelectedCountry(country || null);
    form.setValue("country", countryName);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'ZMW': return 'K';
      default: return '$';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImages(e.target.files);
    }
  };

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    try {
      // Check if bucket exists, create if it doesn't
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('profile-images');

      if (bucketError && bucketError.message.includes('does not exist')) {
        await supabase.storage.createBucket('profile-images', {
          public: true,
          fileSizeLimit: 5242880
        });
      }

      // Upload files in parallel for better performance
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
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

      if (!selectedCountry) {
        throw new Error("Please select a country");
      }

      // Upload images first
      const imageUrls = await uploadImages(selectedImages);

      // Insert profile with proper currency
      const { error } = await supabase.from('profiles').insert({
        name: data.name,
        age: parseInt(data.age),
        location: data.location,
        city: data.city,
        country: selectedCountry.name,
        currency: selectedCountry.currency,
        price_per_hour: parseInt(data.price_per_hour),
        phone: data.phone || null,
        video_url: data.video_url || null,
        images: imageUrls,
        is_premium: data.is_premium || false,
        is_verified: data.is_verified || false,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile created successfully",
      });

      form.reset();
      setSelectedImages(null);
      setSelectedCountry(null);
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
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
            <Input
              {...form.register("age", { required: true })}
              type="number"
              placeholder="Age"
              required
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <Input
              {...form.register("location", { required: true })}
              placeholder="Location"
              required
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
            <Input
              {...form.register("city", { required: true })}
              placeholder="City"
              required
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            {countriesLoading ? (
              <div className="flex items-center space-x-2 bg-[#1e1c2e] border border-gray-700 rounded-md px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-gray-400">Loading countries...</span>
              </div>
            ) : (
              <Select onValueChange={handleCountryChange}>
                <SelectTrigger className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20">
                  <SelectValue placeholder={countries.length > 0 ? "Select a country" : "No countries available"} />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1c2e] border-gray-700">
                  {countries.length > 0 ? (
                    countries.map((country) => (
                      <SelectItem 
                        key={country.id} 
                        value={country.name}
                        className="text-white hover:bg-[#2d2b3a]"
                      >
                        {country.name} ({country.currency})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-countries" disabled className="text-gray-400">
                      No countries available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price per hour {selectedCountry && `(${getCurrencySymbol(selectedCountry.currency)})`}
            </label>
            <Input
              {...form.register("price_per_hour", { required: true })}
              type="number"
              placeholder="Price per hour"
              required
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone number</label>
            <Input
              {...form.register("phone")}
              placeholder="Phone number"
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Video URL</label>
            <Input
              {...form.register("video_url")}
              placeholder="Video URL"
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
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
              className="bg-[#1e1c2e] border-gray-700 focus:border-[#ff719A] focus:ring-[#ff719A]/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="is_verified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={field.value ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600" : ""}
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

          <FormField
            control={form.control}
            name="is_premium"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-800 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={field.value ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600" : ""}
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
        </div>

        <Button type="submit" disabled={loading || countriesLoading} className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90">
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
