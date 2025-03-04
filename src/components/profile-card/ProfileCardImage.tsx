
interface ProfileCardImageProps {
  imageUrl: string;
  name: string;
  isListView: boolean;
}

export function ProfileCardImage({ imageUrl, name, isListView }: ProfileCardImageProps) {
  return (
    <div className={isListView ? "w-40 h-40 flex-shrink-0" : "aspect-[4/5]"}>
      <img
        src={imageUrl}
        alt={name}
        className={`w-full h-full object-cover transition-transform ${
          isListView ? "" : "group-hover:scale-105"
        }`}
      />
    </div>
  );
}
