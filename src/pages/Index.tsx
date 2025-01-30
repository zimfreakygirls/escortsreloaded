import { useState } from "react";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

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
  }
];

export default function Index() {
  const [visibleProfiles, setVisibleProfiles] = useState(4);

  const handleLoadMore = () => {
    setVisibleProfiles(prev => prev + 4);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
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
            <Button size="lg" className="gap-2" onClick={handleLoadMore}>
              <Plus className="w-5 h-5" />
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}