import { useState } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { FavoritesSidebar } from "@/components/FavoritesSidebar";

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

  const handleLoadMore = () => {
    setVisibleProfiles(prev => Math.min(prev + 4, allProfiles.length));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <FavoritesSidebar />
      
      <main className="container pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProfiles.slice(0, visibleProfiles).map((profile) => (
            <Link key={profile.id} to={`/profile/${profile.id}`}>
              <ProfileCard {...profile} />
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