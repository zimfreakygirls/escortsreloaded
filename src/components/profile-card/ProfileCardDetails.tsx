
import { Flag } from "lucide-react";

interface ProfileCardDetailsProps {
  name: string;
  age: number;
  city?: string;
  country?: string;
  showPhone: boolean;
  phone?: string;
  isPremium?: boolean;
  session: any;
  isListView: boolean;
  height?: string;
  weight?: string;
  proportions?: string;
  hairColor?: string;
  eyeColor?: string;
  meetingWith?: string;
}

export function ProfileCardDetails({ 
  name, 
  age, 
  city, 
  country, 
  showPhone, 
  phone,
  isPremium,
  session,
  isListView,
  height,
  weight,
  proportions,
  hairColor,
  eyeColor,
  meetingWith
}: ProfileCardDetailsProps) {
  // For premium profiles, only show phone if user is logged in
  const shouldShowPhone = phone && (!isPremium || (isPremium && session));

  return (
    <div className={`${
      isListView 
        ? "p-4 flex-grow"
        : "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
    }`}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
        {city && country && (
          <p className="text-sm text-gray-300 flex items-center">
            <Flag className="w-3.5 h-3.5 mr-1 text-gray-400" /> {city}, {country}
          </p>
        )}
        {shouldShowPhone && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-primary">☎</span> {phone}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const message = `Hello! I got your number from Escorts Reloaded and would like to connect with you.`;
                  const whatsappUrl = `https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${phone}`;
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        )}
        {isPremium && !session && phone && (
          <p className="text-sm text-gray-300">
            <span className="text-primary">☎</span> <span className="text-amber-400">Login to view contact</span>
          </p>
        )}
        
        {isListView && (
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
            {height && <p>Height: {height}</p>}
            {weight && <p>Weight: {weight}</p>}
            {proportions && <p>Proportions: {proportions}</p>}
            {hairColor && <p>Hair: {hairColor}</p>}
            {eyeColor && <p>Eyes: {eyeColor}</p>}
            {meetingWith && <p>Meeting with: {meetingWith}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
