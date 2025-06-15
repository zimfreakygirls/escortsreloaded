
import { Button } from "../ui/button";
import { BadgeCheck, Crown } from "lucide-react";

interface ProfileStatusButtonsProps {
  profileId: string;
  isVerified: boolean;
  isPremium: boolean;
  updatingStatus: string | null;
  onToggleVerification: (profileId: string, currentStatus: boolean) => void;
  onTogglePremium: (profileId: string, currentStatus: boolean) => void;
}

export function ProfileStatusButtons({
  profileId,
  isVerified,
  isPremium,
  updatingStatus,
  onToggleVerification,
  onTogglePremium,
}: ProfileStatusButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onToggleVerification(profileId, isVerified)}
        disabled={updatingStatus === `verify-${profileId}`}
        className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full transition-all duration-200 ${
          isVerified 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 hover:bg-blue-600" 
            : "bg-gray-700/20 text-gray-400 border-gray-600 hover:bg-gray-700/30 hover:text-gray-300"
        }`}
      >
        <BadgeCheck className="h-4 w-4" />
        {updatingStatus === `verify-${profileId}` ? "Updating..." : (isVerified ? "Verified" : "Verify")}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onTogglePremium(profileId, isPremium)}
        disabled={updatingStatus === `premium-${profileId}`}
        className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full transition-all duration-200 ${
          isPremium 
            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 hover:bg-amber-600" 
            : "bg-gray-700/20 text-gray-400 border-gray-600 hover:bg-gray-700/30 hover:text-gray-300"
        }`}
      >
        <Crown className="h-4 w-4" />
        {updatingStatus === `premium-${profileId}` ? "Updating..." : (isPremium ? "Premium" : "Make Premium")}
      </Button>
    </div>
  );
}
