
import { BadgeCheck, Crown } from "lucide-react";

interface ProfileCardBadgesProps {
  isVerified?: boolean;
  isPremium?: boolean;
}

export function ProfileCardBadges({ isVerified, isPremium }: ProfileCardBadgesProps) {
  if (!isVerified && !isPremium) return null;

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
      {isVerified && (
        <div className="bg-gradient-to-br from-blue-500/95 via-blue-600/90 to-blue-700/95 backdrop-blur-md py-2 px-4 rounded-2xl text-white text-xs font-bold shadow-xl border border-blue-400/30 flex items-center transform hover:scale-105 transition-all duration-300">
          <BadgeCheck className="w-4 h-4 mr-2 drop-shadow-sm" />
          <span className="tracking-wide">VERIFIED</span>
        </div>
      )}
      {isPremium && (
        <div className="bg-gradient-to-br from-amber-500/95 via-amber-600/90 to-orange-600/95 backdrop-blur-md py-2 px-4 rounded-2xl text-white text-xs font-bold shadow-xl border border-amber-400/30 flex items-center transform hover:scale-105 transition-all duration-300">
          <Crown className="w-4 h-4 mr-2 drop-shadow-sm" />
          <span className="tracking-wide">PREMIUM</span>
        </div>
      )}
    </div>
  );
}
