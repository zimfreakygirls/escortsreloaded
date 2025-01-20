import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
}

export const ProfileCard = ({ name, age, location, imageUrl }: ProfileCardProps) => {
  return (
    <div className="profile-card group relative overflow-hidden rounded-lg bg-card">
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
            <p className="text-sm text-gray-300">{location}</p>
          </div>
          <Button size="icon" variant="secondary" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};