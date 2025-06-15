
interface ProfileCardImageProps {
  imageUrl: string;
  name: string;
  isListView: boolean;
}

export function ProfileCardImage({ imageUrl, name, isListView }: ProfileCardImageProps) {
  return (
    <div className={isListView ? "w-40 h-40 flex-shrink-0" : "aspect-[4/5] relative"}>
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-transform ${
          isListView ? "" : "group-hover:scale-105"
        }`}
        style={{ 
          contentVisibility: 'auto',
          containIntrinsicSize: isListView ? '160px 160px' : '300px 375px'
        }}
        onLoad={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.opacity = '1';
        }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '/placeholder.svg';
        }}
      />
    </div>
  );
}
