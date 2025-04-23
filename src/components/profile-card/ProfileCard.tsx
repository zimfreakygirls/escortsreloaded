
import { useProfileSession } from "./useProfileSession";
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
  const session = useProfileSession();

  // Show phone only if:
  // 1. It exists AND
  // 2. User is logged in (if profile is premium and verified) OR profile is not premium
  const showPhone = phone && ((!isPremium && isVerified) || (session && isVerified));

  return (
    <div className={`profile-card group relative ${
      isListView 
        ? "flex items-center gap-6 bg-card rounded-xl overflow-hidden h-full"
        : "rounded-xl overflow-hidden bg-card h-full flex flex-col"
    }`}>
      <ProfileCardImage 
        imageUrl={imageUrl}
        name={name}
        isListView={isListView}
      />

      <ProfileCardBadges 
        isVerified={isVerified}
        isPremium={isPremium}
      />

      <ProfileCardDetails
        name={name}
        age={age}
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
