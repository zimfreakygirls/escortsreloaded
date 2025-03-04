
import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProfileImageGalleryProps {
  profile: any;
}

export function ProfileImageGallery({ profile }: ProfileImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

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
              <DialogContent className="max-w-4xl">
                <video controls className="w-full">
                  <source src={profile.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
