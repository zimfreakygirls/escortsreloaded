
import { Flag } from "lucide-react";

interface ProfileCardDetailsProps {
  name: string;
  age: number;
  city?: string;
  country?: string;
  showPhone: boolean;
  phone?: string;
  isPremium?: boolean;
  session: any;
  isListView: boolean;
  height?: string;
  weight?: string;
  proportions?: string;
  hairColor?: string;
  eyeColor?: string;
  meetingWith?: string;
}

export function ProfileCardDetails({ 
  name, 
  age, 
  city, 
  country, 
  showPhone, 
  phone,
  isPremium,
  session,
  isListView,
  height,
  weight,
  proportions,
  hairColor,
  eyeColor,
  meetingWith
}: ProfileCardDetailsProps) {
  return (
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
        {showPhone && (
          <p className="text-sm text-gray-300">
            <span className="text-primary">☎</span> {phone}
          </p>
        )}
        {isPremium && !session && phone && (
          <p className="text-sm text-gray-300">
            <span className="text-primary">☎</span> <span className="text-amber-400">Login to view contact</span>
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
  );
}
