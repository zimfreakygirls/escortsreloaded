
import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProfileImageGalleryProps {
  profile: any;
}

export function ProfileImageGallery({ profile }: ProfileImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Function to detect if a URL is from Telegram
  const isTelegramVideo = (url: string) => {
    return url && (url.includes('t.me') || url.includes('telegram.me'));
  };

  // Function to render the appropriate video embed based on URL
  const renderVideoContent = () => {
    if (!profile.video_url) return null;
    
    if (isTelegramVideo(profile.video_url)) {
      // For Telegram videos, we use an iframe that embeds the Telegram post
      // Extract post parts from the URL if possible
      let embedUrl = profile.video_url;
      
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
          <source src={profile.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <>
      <div className="relative">
        <div className="rounded-lg overflow-hidden">
          <img 
            src={profile.images[selectedImage] || '/placeholder.svg'} 
            alt={profile.name}
            className="w-full h-[300px] sm:h-[500px] object-cover"
          />
        </div>
        
        {profile.video_url && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90">
                  <Play className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-[#1e1c2e] border-gray-800">
                {renderVideoContent()}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      {profile.images && profile.images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {profile.images.map((image: string, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${
                selectedImage === index ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img 
                src={image} 
                alt={`${profile.name} ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
