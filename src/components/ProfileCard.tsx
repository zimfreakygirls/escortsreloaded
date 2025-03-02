
interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  viewMode?: string;
  height?: string;
  weight?: string;
  proportions?: string;
  hairColor?: string;
  eyeColor?: string;
  meetingWith?: string;
  city?: string;
  country?: string;
  phone?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  showLoginPrompt?: boolean;
}

export function ProfileCard({ 
  name, 
  age, 
  location, 
  imageUrl, 
  viewMode = "grid-3",
  height,
  weight,
  proportions,
  hairColor,
  eyeColor,
  meetingWith,
  city,
  country,
  phone,
  isVerified,
  isPremium,
  showLoginPrompt = false
}: ProfileCardProps) {
  const isListView = viewMode === "list";

  return (
    <div className={`profile-card group relative ${
      isListView 
        ? "flex items-center gap-6 bg-card rounded-xl overflow-hidden"
        : "rounded-xl overflow-hidden bg-card max-w-md mx-auto h-full"
    }`}>
      <div className={isListView ? "w-40 h-40 flex-shrink-0" : "aspect-[4/5]"}>
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform ${
            isListView ? "" : "group-hover:scale-105"
          }`}
        />
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {isVerified && (
          <div className="bg-blue-500/90 backdrop-blur-sm py-1 px-2 rounded-md text-white text-xs font-medium shadow-lg flex items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Verified</span>
          </div>
        )}
      </div>

      <div className={`${
        isListView 
          ? "p-4 flex-grow"
          : "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
      }`}>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
          {city && country && (
            <p className="text-sm text-gray-300">{city}, {country}</p>
          )}
          {phone && isListView && (
            <p className="text-sm text-gray-300">
              <span className="text-primary">☎</span> {phone}
            </p>
          )}
          
          {showLoginPrompt && isListView && (
            <p className="text-sm text-amber-400 font-medium mt-1">
              <a href="/login" className="inline-flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21ZM16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Login to see contact info
              </a>
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
    </div>
  );
}
