
import { BadgeCheck, Crown } from "lucide-react";

interface ProfileCardBadgesProps {
  isVerified?: boolean;
  isPremium?: boolean;
}

export function ProfileCardBadges({ isVerified, isPremium }: ProfileCardBadgesProps) {
  if (!isVerified && !isPremium) return null;

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
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
  );
}
