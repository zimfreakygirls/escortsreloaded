
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  video_url?: string;
  images: string[];
}

export default function Videos() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .not('video_url', 'is', null)
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

  // Function to render the appropriate video embed based on URL
  const renderVideoContent = (videoUrl: string) => {
    if (!videoUrl) return null;
    
    if (isTelegramVideo(videoUrl)) {
      // For Telegram videos, we use an iframe that embeds the Telegram post
      let embedUrl = videoUrl;
      
      // If it's a direct t.me link, convert it to embed format
      if (embedUrl.includes('t.me/')) {
        // Replace t.me with telegram.me for embedding
        embedUrl = embedUrl.replace('t.me/', 'telegram.me/');
        
        // Ensure it has /embed at the end if it's a specific post
        if (!embedUrl.endsWith('/embed') && embedUrl.split('/').length > 4) {
          embedUrl = `${embedUrl}/embed`;
        }
      }
      
      return (
        <iframe 
          src={embedUrl}
          frameBorder="0" 
          width="100%" 
          height="480"
          allowFullScreen
          title="Telegram Video"
          className="rounded-md"
        ></iframe>
      );
    } else {
      // For regular videos (e.g., mp4)
      return (
        <video controls className="w-full rounded-md">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          <h3 className="text-xl font-semibold mb-4">{profile.name}</h3>
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
