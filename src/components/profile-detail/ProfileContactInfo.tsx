
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base sm:text-lg">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="break-all">{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const message = `Hello! I got your number from Escorts Reloaded and would like to connect with you.`;
                const whatsappUrl = `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={() => {
                window.location.href = `tel:${profile.phone}`;
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Call</span>
            </button>
          </div>
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
