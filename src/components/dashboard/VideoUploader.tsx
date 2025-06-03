
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Check, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoUploader() {
  const [form, setForm] = useState({
    name: "",
    telegramUrl: "",
    videoDescription: ""
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    try {
      const fileExt = thumbnailFile.name.split('.').pop();
      const filePath = `video-thumbnails/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      console.log("Uploading thumbnail to:", filePath);
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, thumbnailFile);
        
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      console.log("Upload successful:", data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
        
      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.telegramUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and Telegram video URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Starting video upload process...");
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        console.log("Uploading thumbnail...");
        thumbnailUrl = await uploadThumbnail();
        console.log("Thumbnail uploaded:", thumbnailUrl);
      }
      
      // Create a profile entry for the video
      const newProfile = {
        name: form.name,
        age: 25, // Default age for video entries
        location: "Video Content",
        city: "Video",
        country: "Video",
        price_per_hour: 0, // No pricing for video entries
        video_url: form.telegramUrl,
        images: thumbnailUrl ? [thumbnailUrl] : [],
        is_premium: false,
        is_verified: false
      };
      
      console.log("Inserting profile:", newProfile);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select();
        
      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Profile inserted successfully:", data);
      
      toast({
        title: "Success",
        description: "Video has been added successfully and will appear on the videos page",
      });
      
      // Reset form
      setForm({
        name: "",
        telegramUrl: "",
        videoDescription: ""
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('thumbnailFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error: any) {
      console.error("Error adding video:", error);
      toast({
        title: "Error",
        description: `Failed to add video: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
      <CardHeader className="border-b border-gray-800 pb-6">
        <CardTitle className="text-xl font-medium flex items-center">
          <Video className="w-5 h-5 text-[#9b87f5] mr-2" />
          Add New Telegram Video
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload videos from Telegram to display on the videos page
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter a descriptive title for the video"
                className="bg-[#1e1c2e] border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telegramUrl">Telegram Video URL</Label>
              <Input
                id="telegramUrl"
                name="telegramUrl"
                value={form.telegramUrl}
                onChange={handleInputChange}
                placeholder="https://t.me/channel/video-link"
                className="bg-[#1e1c2e] border-gray-700"
                required
              />
              <p className="text-xs text-gray-400">
                Paste the URL to a Telegram video. The format should be https://t.me/...
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnailFile">Video Thumbnail (Optional)</Label>
              <Input
                id="thumbnailFile"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="bg-[#1e1c2e] border-gray-700"
              />
              
              {thumbnailPreview && (
                <div className="mt-2 relative w-32 h-32 overflow-hidden rounded-md">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoDescription">Description (Optional)</Label>
              <Textarea
                id="videoDescription"
                name="videoDescription"
                value={form.videoDescription}
                onChange={handleInputChange}
                placeholder="Add details about the video"
                className="bg-[#1e1c2e] border-gray-700 resize-y"
                rows={3}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-[#ff719A] to-[#f97316] hover:from-[#ff719A]/90 hover:to-[#f97316]/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Video...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Add Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
