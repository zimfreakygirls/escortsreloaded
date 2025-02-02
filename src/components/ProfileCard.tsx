import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
}

export function ProfileCard({ name, age, location, imageUrl }: ProfileCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? `${name} was removed from your favorites` : `${name} was added to your favorites`,
    });
  };

  return (
    <div className="profile-card group relative rounded-xl overflow-hidden bg-card">
      <div className="aspect-[3/4]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <button
        onClick={handleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? "text-primary fill-primary" : "text-white"
          }`}
        />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
        <p className="text-sm text-gray-300">{location}</p>
      </div>
    </div>
  );
}