import { Heart, MessageSquare, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
}

export const ProfileCard = ({ name, age, location, imageUrl }: ProfileCardProps) => {
  return (
    <div className="profile-card group relative overflow-hidden rounded-lg">
      <img
        src={imageUrl}
        alt={name}
        className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};