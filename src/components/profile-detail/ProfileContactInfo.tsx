
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
          <button
            onClick={() => {
              const message = `Hello! I got your number from Escorts Reloaded and would like to connect with you.`;
              const whatsappUrl = `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="text-green-500 hover:text-green-400 transition-colors cursor-pointer"
          >
            {profile.phone} (WhatsApp)
          </button>
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
