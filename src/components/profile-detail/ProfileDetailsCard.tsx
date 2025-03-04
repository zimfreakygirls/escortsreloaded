
import { ProfileContactInfo } from "./ProfileContactInfo";

interface ProfileDetailsCardProps {
  profile: any;
  showPhone: boolean;
  session: any;
}

export function ProfileDetailsCard({ profile, showPhone, session }: ProfileDetailsCardProps) {
  return (
    <div className="mt-6 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">{profile.name}, {profile.age}</h1>
      <ProfileContactInfo profile={profile} showPhone={showPhone} session={session} />
    </div>
  );
}
