
import { useAuthSession } from "@/hooks/useAuthSession";
import { ProfileCardBadges } from "./ProfileCardBadges";
import { ProfileCardImage } from "./ProfileCardImage";
import { ProfileCardDetails } from "./ProfileCardDetails";

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
  const session = useAuthSession();

  // For premium profiles, only show phone if user is logged in
  const showPhone = phone && (!isPremium || (isPremium && session));

  return (
    <div className={`profile-card group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isListView 
        ? "flex items-stretch bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 h-full"
        : "bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 h-full hover:scale-[1.02]"
    }`}>
      {!isListView && (
        <div className="relative overflow-hidden rounded-t-2xl">
          <ProfileCardImage 
            imageUrl={imageUrl}
            name={name}
            isListView={isListView}
          />
          <ProfileCardBadges 
            isVerified={isVerified}
            isPremium={isPremium}
          />
        </div>
      )}
      
      {isListView && (
        <div className="relative overflow-hidden rounded-l-2xl">
          <ProfileCardImage 
            imageUrl={imageUrl}
            name={name}
            isListView={isListView}
          />
          <ProfileCardBadges 
            isVerified={isVerified}
            isPremium={isPremium}
          />
        </div>
      )}

      <ProfileCardDetails
        name={name}
        age={age}
        location={location}
        city={city}
        country={country}
        showPhone={showPhone}
        phone={phone}
        isPremium={isPremium}
        session={session}
        isListView={isListView}
        height={height}
        weight={weight}
        proportions={proportions}
        hairColor={hairColor}
        eyeColor={eyeColor}
        meetingWith={meetingWith}
      />
    </div>
  );
}
