
import { Flag } from "lucide-react";

interface ProfileCardDetailsProps {
  name: string;
  age: number;
  location?: string;
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
  location,
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
        ? "flex-1 p-6 flex flex-col justify-between min-h-0"
        : "p-5 bg-card border-t border-border/50"
    }`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className={`font-semibold text-foreground leading-tight ${
              isListView 
                ? "text-lg sm:text-xl md:text-2xl" 
                : "text-base sm:text-lg md:text-xl"
            }`}>
              {name}
            </h3>
            <p className={`text-muted-foreground font-medium ${
              isListView ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            }`}>
              {age} years old
            </p>
          </div>
          {!isListView && shouldShowPhone && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const message = `Hello! I got your number from Escorts Reloaded and would like to connect with you.`;
                  const whatsappUrl = `https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg text-xs transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${phone}`;
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg text-xs transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {(location || city || country) && (
          <div className="flex items-center gap-3 px-3 py-2 bg-muted/20 rounded-lg border border-border/40">
            <Flag className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className={`text-muted-foreground font-medium ${
              isListView ? "text-sm" : "text-xs"
            }`}>
              {[location, city, country].filter(Boolean).join(' • ')}
            </p>
          </div>
        )}

        {shouldShowPhone && isListView && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary">☎</span>
              <span className="font-mono text-xs">{phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const message = `Hello! I got your number from Escorts Reloaded and would like to connect with you.`;
                  const whatsappUrl = `https://wa.me/${phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-sm font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                </svg>
                WhatsApp
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${phone}`;
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-sm font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </button>
            </div>
          </div>
        )}

        {isPremium && !session && phone && (
          <div className="flex items-center gap-2">
            <span className="text-primary">☎</span>
            <span className="text-sm text-amber-400 font-medium">Login to view contact</span>
          </div>
        )}

        {isListView && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {height && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">📏</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Height</span>
                  <span className="text-sm font-semibold text-foreground">{height}</span>
                </div>
              </div>
            )}
            {weight && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">⚖️</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Weight</span>
                  <span className="text-sm font-semibold text-foreground">{weight}</span>
                </div>
              </div>
            )}
            {proportions && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">📐</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Proportions</span>
                  <span className="text-sm font-semibold text-foreground">{proportions}</span>
                </div>
              </div>
            )}
            {hairColor && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">💇</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Hair</span>
                  <span className="text-sm font-semibold text-foreground">{hairColor}</span>
                </div>
              </div>
            )}
            {eyeColor && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">👁️</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Eyes</span>
                  <span className="text-sm font-semibold text-foreground">{eyeColor}</span>
                </div>
              </div>
            )}
            {meetingWith && (
              <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg border border-border/30">
                <span className="text-base">🤝</span>
                <div>
                  <span className="text-xs text-muted-foreground font-medium block">Meeting</span>
                  <span className="text-sm font-semibold text-foreground">{meetingWith}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
