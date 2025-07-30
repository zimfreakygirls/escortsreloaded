
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
        <div className="bg-blue-600 backdrop-blur-sm py-1.5 px-3 rounded-lg text-white text-xs font-semibold shadow-md border border-blue-500/30 flex items-center">
          <BadgeCheck className="w-3.5 h-3.5 mr-1.5" />
          <span>Verified</span>
        </div>
      )}
      {isPremium && (
        <div className="bg-amber-600 backdrop-blur-sm py-1.5 px-3 rounded-lg text-white text-xs font-semibold shadow-md border border-amber-500/30 flex items-center">
          <Crown className="w-3.5 h-3.5 mr-1.5" />
          <span>Premium</span>
        </div>
      )}
    </div>
  );
}
