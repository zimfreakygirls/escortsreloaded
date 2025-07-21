import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimationWrapper } from "../ui/animation-wrapper";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, Loader2, ExternalLink, Image, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PaymentVerification {
  id: string;
  user_id: string;
  proof_image_url: string;
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
  email?: string;
  username?: string;
}

const SUPABASE_URL = "https://flzioxdlsyxapirlbxbt.supabase.co";

export function PaymentVerificationsTabContent() {
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      
      const { data: verificationData, error } = await supabase
        .from('payment_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching verifications:', error);
        toast({
          title: "Error",
          description: "Failed to load payment verifications",
          variant: "destructive",
        });
        return;
      }

      // If we have verifications, get the user details from user_profiles table
      if (verificationData && verificationData.length > 0) {
        const userIds = verificationData.map(v => v.user_id);
        
        // Get user profiles from our user_profiles table
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('user_id', userIds);

        if (userProfilesError) {
          console.error('Error fetching user profiles:', userProfilesError);
          // Continue with verification data without user info
          setVerifications(verificationData.map(verification => ({
            ...verification,
            status: verification.status as 'pending' | 'approved' | 'declined',
            email: `user-${verification.user_id.substring(0, 6)}@unknown.com`,
            username: 'Unknown User'
          })));
          return;
        }

        // Create a map of user profiles by user_id
        const userProfilesMap = new Map();
        if (userProfilesData) {
          userProfilesData.forEach(profile => {
            userProfilesMap.set(profile.user_id, profile);
          });
        }

        // Enrich verifications with user data
        const enrichedVerifications = verificationData.map(verification => {
          const userProfile = userProfilesMap.get(verification.user_id);
          
          return {
            ...verification,
            status: verification.status as 'pending' | 'approved' | 'declined',
            email: userProfile?.email || `user-${verification.user_id.substring(0, 6)}@unknown.com`,
            username: userProfile?.username || userProfile?.full_name || 'Unknown User'
          };
        });

        setVerifications(enrichedVerifications);
      } else {
        setVerifications([]);
      }
    } catch (error) {
      console.error('Error in fetchVerifications:', error);
      toast({
        title: "Error", 
        description: "Failed to load payment verifications",
        variant: "destructive",
      });
      setVerifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApproval = async (id: string, userId: string, approve: boolean) => {
    setProcessingId(id);
    try {
      const status = approve ? 'approved' : 'declined';
      // Update the payment_verifications table
      const { error: updateError } = await supabase
        .from('payment_verifications')
        .update({ status })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // If approved, update the user_status table
      if (approve) {
        const { error: statusError } = await supabase
          .from('user_status')
          .update({ approved: true })
          .eq('user_id', userId);
        if (statusError) throw statusError;
      }

      toast({
        title: approve ? "User Approved" : "User Declined",
        description: approve 
          ? "User account has been approved and they can now log in" 
          : "User registration has been declined",
      });
      
      fetchVerifications();
    } catch (error: any) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process verification",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Function to handle image loading errors and set a fallback
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({...prev, [id]: true}));
  };

  // Function to get the signed URL for the image
  const getSignedImageUrl = async (filePath: string) => {
    try {
      console.log('Getting signed URL for:', filePath);
      
      // If it's already a full URL, return it as is
      if (filePath.startsWith('http')) {
        return filePath;
      }
      
      // Extract just the filename if it's a path
      let fileName = filePath;
      if (filePath.includes('/')) {
        fileName = filePath.split('/').pop() || filePath;
      }
      
      // Try to get signed URL from the correct bucket name (payment-proofs)
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(fileName, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error creating signed URL:', error);
        // Fallback to public URL with correct bucket name
        return `${SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;
      }
      
      console.log('Generated signed URL:', data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedImageUrl:', error);
      // Fallback to public URL with correct bucket name
      const fileName = filePath.includes('/') ? filePath.split('/').pop() : filePath;
      return `${SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-[#9b87f5] rounded-full"></div>
      </div>
    );
  }

  return (
    <TabsContent value="payments" className="space-y-4">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold">Payment Verifications</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchVerifications}
          className="border-[#9b87f5]/30 hover:bg-[#9b87f5]/10"
        >
          Refresh
        </Button>
      </div>
      
      <AnimationWrapper animation="fade" duration={0.5} className="space-y-6">
        <div className="rounded-md border border-gray-800 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1e1c2e]">
              <TableRow className="hover:bg-transparent border-gray-800">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Proof</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No payment verifications found
                  </TableCell>
                </TableRow>
              ) : (
                verifications.map((verification) => (
                  <TableRow key={verification.id} className="border-gray-800 hover:bg-[#1e1c2e]/30">
                    <TableCell className="font-medium text-white">
                      <div className="flex flex-col">
                        <span>{verification.username}</span>
                        <span className="text-sm text-gray-400">{verification.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {formatDate(verification.created_at)}
                    </TableCell>
                    <TableCell>
                      {verification.status === 'pending' && (
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300 border-yellow-700">
                          Pending
                        </Badge>
                      )}
                      {verification.status === 'approved' && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 border-green-700">
                          Approved
                        </Badge>
                      )}
                      {verification.status === 'declined' && (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                          Declined
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#9b87f5] hover:text-[#8b77e5] hover:bg-[#9b87f5]/10">
                            <Image className="mr-1 h-4 w-4" /> View Proof
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-[#292741] border border-[#9b87f5]/30">
                          <DialogTitle className="text-center text-lg font-semibold text-white">Payment Proof</DialogTitle>
                          <DialogDescription className="text-center text-gray-400 text-sm">
                            Review the payment proof submitted by the user
                          </DialogDescription>
                          <div className="flex flex-col items-center p-2">
                            {verification.proof_image_url ? (
                              <>
                                <div className="relative w-full h-auto max-h-[70vh] flex items-center justify-center">
                                  {imageErrors[verification.id] ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-gray-400 border border-dashed border-gray-700 rounded-md w-full">
                                      <AlertTriangle className="h-10 w-10 mb-2 text-yellow-500" />
                                      <p className="text-center mb-1">Unable to load image</p>
                                      <p className="text-xs text-center">The image file may not exist or is corrupted</p>
                                      <p className="text-xs text-center mt-2 text-gray-500 break-all">URL: {verification.proof_image_url}</p>
                                    </div>
                                  ) : (
                                    <ImageWithFallback 
                                      src={verification.proof_image_url}
                                      alt="Payment Proof"
                                      onError={() => handleImageError(verification.id)}
                                      getSignedUrl={getSignedImageUrl}
                                    />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      const signedUrl = await getSignedImageUrl(verification.proof_image_url);
                                      window.open(signedUrl, '_blank');
                                    } catch (error) {
                                      console.error('Error opening image:', error);
                                    }
                                  }}
                                  className="mt-4 text-[#9b87f5] hover:text-[#8b77e5] transition-colors"
                                >
                                  Open in new tab <ExternalLink className="ml-1 h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <div className="text-gray-400 p-8 flex flex-col items-center">
                                <AlertTriangle className="h-8 w-8 mb-2 text-yellow-500" />
                                <p>No image available</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      {verification.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproval(verification.id, verification.user_id, true)}
                            disabled={processingId === verification.id}
                          >
                            {processingId === verification.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproval(verification.id, verification.user_id, false)}
                            disabled={processingId === verification.id}
                          >
                            {processingId === verification.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-1" /> Decline
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-sm">
                          {verification.status === 'approved' ? 'Approved' : 'Declined'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AnimationWrapper>
    </TabsContent>
  );
}

// Separate component for image handling with async signed URL support
function ImageWithFallback({ 
  src, 
  alt, 
  onError, 
  getSignedUrl 
}: { 
  src: string; 
  alt: string; 
  onError: () => void;
  getSignedUrl: (path: string) => Promise<string>;
}) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const signedUrl = await getSignedUrl(src);
        setImageSrc(signedUrl);
      } catch (err) {
        console.error('Failed to load image:', err);
        setError(true);
        onError();
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [src, getSignedUrl, onError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 w-full h-48">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400 border border-dashed border-gray-700 rounded-md w-full">
        <AlertTriangle className="h-10 w-10 mb-2 text-yellow-500" />
        <p className="text-center mb-1">Unable to load image</p>
        <p className="text-xs text-center">The image file may not exist or is corrupted</p>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className="max-w-full max-h-[70vh] object-contain rounded-md"
      onError={() => {
        setError(true);
        onError();
      }}
    />
  );
}