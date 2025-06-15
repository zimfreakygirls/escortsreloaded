
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { ProfileDetailHeader } from "@/components/profile-detail/ProfileDetailHeader";
import { ProfileImageGallery } from "@/components/profile-detail/ProfileImageGallery";
import { ProfileDetailsCard } from "@/components/profile-detail/ProfileDetailsCard";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function ProfileDetail() {
  const { id } = useParams();
  const { profile, loading } = useProfileRealtime(id);
  const session = useAuthSession();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center">Profile not found</div>
        </main>
      </div>
    );
  }

  // Only show phone if:
  // 1. It exists AND
  // 2. User is logged in (if profile is premium) OR profile is not premium
  const showPhone = profile.phone && ((!profile.is_premium && profile.is_verified) || (session && profile.is_verified));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <ProfileDetailHeader profile={profile} />
          <ProfileImageGallery profile={profile} />
          <ProfileDetailsCard profile={profile} showPhone={showPhone} session={session} />
        </div>
      </main>
    </div>
  );
}
