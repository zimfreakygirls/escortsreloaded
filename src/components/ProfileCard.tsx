
interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  viewMode?: string;
}

export function ProfileCard({ name, age, location, imageUrl, viewMode = "grid-4" }: ProfileCardProps) {
  const isListView = viewMode === "list";

  return (
    <div className={`profile-card group relative w-full ${
      isListView 
        ? "flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-card rounded-xl overflow-hidden"
        : "rounded-xl overflow-hidden bg-card"
    }`}>
      <div className={isListView ? "w-full sm:w-40 h-48 sm:h-40 flex-shrink-0" : "aspect-[3/4]"}>
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform ${
            isListView ? "" : "group-hover:scale-105"
          }`}
        />
      </div>

      <div className={`${
        isListView 
          ? "p-4 flex-grow"
          : "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
      }`}>
        <h3 className="text-lg font-semibold text-white">{name}, {age}</h3>
        <p className="text-sm text-gray-300">{location}</p>
      </div>
    </div>
  );
}
