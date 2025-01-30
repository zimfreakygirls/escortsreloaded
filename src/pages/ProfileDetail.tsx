import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Phone, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const profiles = [
  {
    id: "1",
    name: "Dilara",
    age: 20,
    location: "Zambia",
    city: "Chipata",
    images: [
      "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png",
      "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png",
      "/lovable-uploads/489eb213-d4d5-4f55-8027-30e1766dca1e.png"
    ],
    videoUrl: "https://example.com/sample-video.mp4",
    pricePerHour: 150,
    phone: "+260 97 123 4567"
  },
  {
    id: "2",
    name: "Antonella",
    age: 26,
    location: "Zimbabwe",
    city: "Kasama",
    images: [
      "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png",
      "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png",
      "/lovable-uploads/489eb213-d4d5-4f55-8027-30e1766dca1e.png"
    ],
    videoUrl: "https://example.com/sample-video.mp4",
    pricePerHour: 200,
    phone: "+260 97 234 5678"
  },
  {
    id: "3",
    name: "Meletta",
    age: 19,
    location: "Malawi",
    city: "Kabwe",
    images: [
      "/lovable-uploads/489eb213-d4d5-4f55-8027-30e1766dca1e.png",
      "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png",
      "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png"
    ],
    videoUrl: "https://example.com/sample-video.mp4",
    pricePerHour: 180,
    phone: "+260 97 345 6789"
  }
];

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={profile.images[selectedImage]} 
                alt={profile.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90">
                    <Play className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <video controls className="w-full">
                    <source src={profile.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {profile.images.map((image, index) => (
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
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>
          
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold">{profile.name}, {profile.age}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{profile.location}, {profile.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                <span>${profile.pricePerHour}/hr</span>
              </div>
              
              <div className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                <span>{profile.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}