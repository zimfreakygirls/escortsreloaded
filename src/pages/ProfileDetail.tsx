import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { ProfileDetailHeader } from "@/components/profile-detail/ProfileDetailHeader";
import { ProfileImageGallery } from "@/components/profile-detail/ProfileImageGallery";
import { ProfileDetailsCard } from "@/components/profile-detail/ProfileDetailsCard";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfileDetail() {
  const { id } = useParams();
  const { profile, loading } = useProfileRealtime(id);
  const session = useAuthSession();
  const [isApproved, setIsApproved] = useState(false);
  const [checkingApproval, setCheckingApproval] = useState(true);

  useEffect(() => {
    const checkUserApproval = async () => {
      if (!session?.user?.id) {
        setCheckingApproval(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_status')
          .select('approved')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error checking approval:', error);
          setIsApproved(false);
        } else {
          setIsApproved(data?.approved || false);
        }
      } catch (error) {
        console.error('Error checking approval:', error);
        setIsApproved(false);
      } finally {
        setCheckingApproval(false);
      }
    };

    checkUserApproval();
  }, [session]);

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
  // 2. User is logged in AND approved (if profile is premium) OR profile is not premium
  // 3. Profile is verified
  const showPhone = profile.phone && 
    profile.is_verified && 
    ((!profile.is_premium) || (session && isApproved));

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <ProfileDetailHeader profile={profile} />
          <ProfileImageGallery profile={profile} />
          <ProfileDetailsCard 
            profile={profile} 
            showPhone={showPhone} 
            session={session}
            isApproved={isApproved}
            checkingApproval={checkingApproval}
          />
        </div>
      </main>
    </div>
  );
}
