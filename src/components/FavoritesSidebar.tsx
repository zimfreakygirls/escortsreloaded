import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";

interface FavoriteProfile {
  id: string;
  name: string;
  imageUrl: string;
}

export const FavoritesSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // This would typically come from a global state management solution
  const favorites: FavoriteProfile[] = [
    {
      id: "1",
      name: "Dilara",
      imageUrl: "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png"
    },
    {
      id: "2",
      name: "Antonella",
      imageUrl: "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png"
    }
  ];

  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-32px)]'}`}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-primary hover:bg-primary/90 text-white p-1.5 rounded-r-md"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        
        <Card className="w-64 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 p-4 rounded-r-none border-r-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-primary" size={20} />
            <h3 className="font-semibold">Favorites</h3>
          </div>
          
          <div className="space-y-3">
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorites yet</p>
            ) : (
              favorites.map(profile => (
                <div key={profile.id} className="flex items-center gap-3">
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{profile.name}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};