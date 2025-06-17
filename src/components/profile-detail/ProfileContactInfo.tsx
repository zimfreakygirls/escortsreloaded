
import { MapPin, Clock, Phone, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileContactInfoProps {
  profile: any;
  showPhone: boolean;
  session: any;
}

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'ZMW': return 'K';
    default: return '$';
  }
};

export function ProfileContactInfo({ profile, showPhone, session }: ProfileContactInfoProps) {
  const currencySymbol = getCurrencySymbol(profile.currency || 'USD');
  
  // For premium profiles, only show phone if user is logged in
  const shouldShowPhone = profile.phone && (!profile.is_premium || (profile.is_premium && session));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex items-center gap-2 text-base sm:text-lg">
        <MapPin className="h-5 w-5 text-primary" />
        <span>{profile.location}, {profile.city}</span>
      </div>
      
      <div className="flex items-center gap-2 text-base sm:text-lg">
        <Clock className="h-5 w-5 text-primary" />
        <span>{currencySymbol}{profile.price_per_hour}/hr</span>
      </div>
      
      {shouldShowPhone ? (
        <div className="flex items-center gap-2 text-base sm:text-lg">
          <Phone className="h-5 w-5 text-primary" />
          <span>{profile.phone}</span>
        </div>
      ) : profile.is_premium && !session && profile.phone ? (
        <div className="flex items-center gap-2 text-base sm:text-lg border border-primary/30 rounded-md p-2 bg-primary/5">
          <Lock className="h-5 w-5 text-primary" />
          <Link to="/login" className="text-primary hover:underline">Login to view contact</Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-base sm:text-lg">
          <Phone className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400">No phone number provided</span>
        </div>
      )}
    </div>
  );
}
