
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VideoProfile {
  id: string;
  name: string;
  video_url: string | null;
  images: string[];
  is_video: boolean | null;
}

export default function Videos() {
  const [profiles, setProfiles] = useState<VideoProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, video_url, images, is_video')
          .not('video_url', 'is', null)
          .eq('is_video', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error('Error fetching profiles with videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Function to detect if a URL is from Telegram
  const isTelegramVideo = (url: string) => {
    return url && (url.includes('t.me') || url.includes('telegram.me'));
  };

  // Function to convert Telegram URL to embeddable format
  const getTelegramEmbedUrl = (url: string) => {
    if (!url || !isTelegramVideo(url)) return url;
    
    try {
      // Extract the channel and message ID from the URL
      const urlParts = url.split('/');
      if (urlParts.length >= 4) {
        const channel = urlParts[urlParts.length - 2];
        const messageId = urlParts[urlParts.length - 1];
        
        // Create embed URL
        return `https://t.me/${channel}/${messageId}?embed=1`;
      }
    } catch (error) {
      console.error('Error processing Telegram URL:', error);
    }
    
    return url;
  };

  // Function to render the appropriate video embed based on URL
  const renderVideoContent = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    if (isTelegramVideo(videoUrl)) {
      const embedUrl = getTelegramEmbedUrl(videoUrl);
      
      return (
        <div className="space-y-4">
          <iframe 
            src={embedUrl}
            frameBorder="0" 
            width="100%" 
            height="480"
            allowFullScreen
            title="Telegram Video"
            className="rounded-md"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
          <div className="text-center">
            <Button
              onClick={() => window.open(videoUrl, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Open in Telegram
            </Button>
          </div>
        </div>
      );
    } else {
      // For regular videos (e.g., mp4)
      return (
        <video controls className="w-full rounded-md" autoPlay={false}>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Videos</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="mt-2 text-muted-foreground">Loading videos...</p>
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden bg-card">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-video bg-muted">
                    <img 
                      src={profile.images[0] || '/placeholder.svg'} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full w-16 h-16 bg-primary/90 hover:bg-primary border-none text-white">
                            <Play className="h-8 w-8" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-[#1e1c2e] border-gray-800">
                          <h3 className="text-xl font-semibold mb-4 text-white">{profile.name}</h3>
                          {profile.video_url && renderVideoContent(profile.video_url)}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1">{profile.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
