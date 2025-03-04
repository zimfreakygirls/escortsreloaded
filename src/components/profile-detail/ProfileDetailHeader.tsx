
import { Badge } from "@/components/ui/badge";

interface ProfileDetailHeaderProps {
  profile: any;
}

export function ProfileDetailHeader({ profile }: ProfileDetailHeaderProps) {
  return (
    <div className="flex gap-2 mb-4">
      {profile.is_premium && (
        <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full px-3 py-1 flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Premium
        </Badge>
      )}
      {profile.is_verified && (
        <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-3 py-1 flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Verified
        </Badge>
      )}
    </div>
  );
}
