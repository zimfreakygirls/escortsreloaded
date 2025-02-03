import { useState } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus, Grid2x2, Grid3x3, LayoutList } from "lucide-react";
import { Link } from "react-router-dom";
import { FavoritesSidebar } from "@/components/FavoritesSidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const allProfiles = [
  {
    id: "1",
    name: "Dilara",
    age: 20,
    location: "Chipata",
    imageUrl: "/lovable-uploads/f2943c08-ebe4-4da4-b40b-904c59b53504.png"
  },
  {
    id: "2",
    name: "Antonella",
    age: 26,
    location: "Kasama",
    imageUrl: "/lovable-uploads/fe7e6966-e4f3-4054-bc81-c63bfe7a5613.png"
  },
  {
    id: "3",
    name: "Meletta",
    age: 19,
    location: "Kabwe",
    imageUrl: "/lovable-uploads/489eb213-d4d5-4f55-8027-30e1766dca1e.png"
  },
  {
    id: "4",
    name: "Sarah",
    age: 23,
    location: "Lusaka",
    imageUrl: "https://images.unsplash.com/photo-1517022812141-23620dba5c23"
  },
  {
    id: "5",
    name: "Elena",
    age: 24,
    location: "Ndola",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
  },
  {
    id: "6",
    name: "Maria",
    age: 22,
    location: "Kitwe",
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a"
  },
  {
    id: "7",
    name: "Lisa",
    age: 25,
    location: "Livingstone",
    imageUrl: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632"
  }
];

export default function Index() {
  const [visibleProfiles, setVisibleProfiles] = useState(4);
  const [viewMode, setViewMode] = useState("grid-3");

  const handleLoadMore = () => {
    setVisibleProfiles(prev => Math.min(prev + 4, allProfiles.length));
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "list":
        return "grid-cols-1 max-w-3xl mx-auto";
      case "grid-2":
        return "grid-cols-1 sm:grid-cols-2";
      case "grid-3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getCardClass = () => {
    if (viewMode === "list") {
      return "block w-full";
    }
    return "";
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      <FavoritesSidebar />
      
      <main className="container pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Discover Profiles</h1>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => {
              if (value) {
                console.log("View mode changed to:", value);
                setViewMode(value);
              }
            }}
            className="bg-secondary rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="list" 
              aria-label="List View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="grid-2" 
              aria-label="2x2 Grid View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <Grid2x2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="grid-3" 
              aria-label="3x3 Grid View"
              className="data-[state=on]:bg-primary data-[state=on]:text-white px-3 py-2 transition-colors"
            >
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className={`grid ${getGridClass()} gap-6`}>
          {allProfiles.slice(0, visibleProfiles).map((profile) => (
            <Link key={profile.id} to={`/profile/${profile.id}`} className={getCardClass()}>
              <ProfileCard {...profile} viewMode={viewMode} />
            </Link>
          ))}
        </div>
        
        {visibleProfiles < allProfiles.length && (
          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              onClick={handleLoadMore}
              className="px-8 py-6 bg-gradient-to-r from-primary/90 to-purple-500 hover:from-primary hover:to-purple-600 transition-all duration-300 text-base shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Load More Profiles
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}