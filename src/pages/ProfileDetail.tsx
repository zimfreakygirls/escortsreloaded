import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { MapPin, Clock, Phone } from "lucide-react";

const profiles = [
  {
    id: "1",
    name: "Dilara",
    age: 20,
    location: "Chipata",
    imageUrl: "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png",
    pricePerHour: 150,
    phone: "+260 97 123 4567"
  },
  {
    id: "2",
    name: "Antonella",
    age: 26,
    location: "Kasama",
    imageUrl: "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png",
    pricePerHour: 200,
    phone: "+260 97 234 5678"
  },
  {
    id: "3",
    name: "Meletta",
    age: 19,
    location: "Kabwe",
    imageUrl: "/lovable-uploads/489eb213-d4d5-4f55-8027-30e1766dca1e.png",
    pricePerHour: 180,
    phone: "+260 97 345 6789"
  }
];

export default function ProfileDetail() {
  const { id } = useParams();
  const profile = profiles.find(p => p.id === id);

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={profile.imageUrl} 
              alt={profile.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold">{profile.name}, {profile.age}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{profile.location}</span>
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