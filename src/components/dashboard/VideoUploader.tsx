
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Check, Video, Trash2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface VideoProfile {
  id: string;
  name: string;
  video_url: string;
  images: string[];
  created_at: string;
}

export function VideoUploader() {
  const [form, setForm] = useState({
    name: "",
    telegramUrl: "",
    videoDescription: ""
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setSaving] = useState(false);
  const [videos, setVideos] = useState<VideoProfile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, video_url, images, created_at')
        .not('video_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive"
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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
      const filePath = `thumbnails/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, thumbnailFile);
        
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
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
      setSaving(true);
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
      }
      
      // Create a profile entry for the video with is_video flag
      const newProfile = {
        name: form.name,
        age: 0,
        location: "Video",
        city: "Video", 
        country: "Video",
        price_per_hour: 0,
        video_url: form.telegramUrl,
        images: thumbnailUrl ? [thumbnailUrl] : [],
        is_video: true
      };
      
      const { error } = await supabase
        .from('profiles')
        .insert([newProfile]);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Video has been added successfully",
      });
      
      // Reset form
      setForm({
        name: "",
        telegramUrl: "",
        videoDescription: ""
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
      
      // Refresh videos list
      fetchVideos();
      
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video has been deleted successfully",
      });

      // Refresh videos list
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive"
      });
    }
  };

  // Function to render video preview
  const renderVideoPreview = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    // For Telegram videos, show a simple preview message
    if (videoUrl.includes('t.me') || videoUrl.includes('telegram.me')) {
      return (
        <div className="text-sm text-gray-400">
          Telegram Video: {videoUrl}
        </div>
      );
    } else {
      // For regular videos
      return (
        <video controls className="w-32 h-20 rounded-md">
          <source src={videoUrl} type="video/mp4" />
          Preview not available
        </video>
      );
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Video Management Table */}
      <Card className="border-0 shadow-xl bg-[#292741] backdrop-blur-sm text-white">
        <CardHeader className="border-b border-gray-800 pb-6">
          <CardTitle className="text-xl font-medium">Manage Videos</CardTitle>
          <CardDescription className="text-gray-400">
            View and delete existing videos
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingVideos ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Loading videos...</p>
            </div>
          ) : videos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Video URL</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>{video.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a 
                        href={video.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {video.video_url}
                      </a>
                    </TableCell>
                    <TableCell>
                      {video.images[0] ? (
                        <img 
                          src={video.images[0]} 
                          alt={video.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-600 rounded flex items-center justify-center">
                          <Video className="w-4 h-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(video.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">No videos found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
