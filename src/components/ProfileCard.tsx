
import { Flag, BadgeCheck, Crown } from "lucide-react";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  viewMode?: string;
  height?: string;
  weight?: string;
  proportions?: string;
  hairColor?: string;
  eyeColor?: string;
  meetingWith?: string;
  city?: string;
  country?: string;
  phone?: string;
  isVerified?: boolean;
  isPremium?: boolean;
}

export function ProfileCard({ 
  name, 
  age, 
  location, 
  imageUrl, 
  viewMode = "grid-3",
  height,
  weight,
  proportions,
  hairColor,
  eyeColor,
  meetingWith,
  city,
  country,
  phone,
  isVerified,
  isPremium
}: ProfileCardProps) {
  const isListView = viewMode === "list";

  return (
    <div className={`profile-card group relative ${
      isListView 
        ? "flex items-center gap-6 bg-card rounded-xl overflow-hidden"
        : "rounded-xl overflow-hidden bg-card max-w-md mx-auto h-full"
    }`}>
      <div className={isListView ? "w-40 h-40 flex-shrink-0" : "aspect-[4/5]"}>
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform ${
            isListView ? "" : "group-hover:scale-105"
          }`}
        />
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isVerified && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 backdrop-blur-sm py-1 px-3 rounded-full text-white text-xs font-medium shadow-lg flex items-center">
            <BadgeCheck className="w-4 h-4 mr-1" />
            <span>Verified</span>
          </div>
        )}
        {isPremium && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 backdrop-blur-sm py-1 px-3 rounded-full text-white text-xs font-medium shadow-lg flex items-center">
            <Crown className="w-4 h-4 mr-1" />
            <span>Premium</span>
          </div>
        )}
      </div>

      <div className={`${
        isListView 
          ? "p-4 flex-grow"
          : "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
      }`}>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
          {city && country && (
            <p className="text-sm text-gray-300 flex items-center">
              <Flag className="w-3.5 h-3.5 mr-1 text-gray-400" /> {city}, {country}
            </p>
          )}
          {phone && (isVerified || isPremium) && (
            <p className="text-sm text-gray-300">
              <span className="text-primary">☎</span> {phone}
            </p>
          )}
          
          {isListView && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
              {height && <p>Height: {height}</p>}
              {weight && <p>Weight: {weight}</p>}
              {proportions && <p>Proportions: {proportions}</p>}
              {hairColor && <p>Hair: {hairColor}</p>}
              {eyeColor && <p>Eyes: {eyeColor}</p>}
              {meetingWith && <p>Meeting with: {meetingWith}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
