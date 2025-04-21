
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Step enum to track signup process
enum SignupStep {
  REGISTRATION = 'registration',
  PAYMENT_INSTRUCTIONS = 'payment_instructions',
  PROOF_OF_PAYMENT = 'proof_of_payment',
  CONFIRMATION = 'confirmation'
}

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.REGISTRATION);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Generate a temporary email using the username
      const tempEmail = `${values.username.toLowerCase()}@escortsreloaded.com`;
      setEmail(tempEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: values.password,
        options: {
          data: {
            username: values.username,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setUserId(data.user.id);
        
        // Create entry in user_status table
        const { error: statusError } = await supabase
          .from('user_status')
          .insert([
            { user_id: data.user.id, approved: false, banned: false }
          ]);
          
        if (statusError) throw statusError;
      }

      toast({
        title: "Account created!",
        description: "Please complete the payment step to activate your account.",
      });

      // Move to payment instructions step
      setCurrentStep(SignupStep.PAYMENT_INSTRUCTIONS);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadProofOfPayment = async () => {
    if (!selectedFile || !userId) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploadingProof(true);
    try {
      // Upload to storage bucket
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-proof-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);
        
      // Update user_status with proof image URL
      const { error: updateError } = await supabase
        .from('payment_verifications')
        .insert([
          { 
            user_id: userId, 
            proof_image_url: publicUrlData.publicUrl,
            status: 'pending'
          }
        ]);

      if (updateError) throw updateError;

      toast({
        title: "Proof uploaded successfully!",
        description: "The admin will review your payment proof and approve your account.",
      });
      
      setCurrentStep(SignupStep.CONFIRMATION);
    } catch (error: any) {
      toast({
        title: "Error uploading proof",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingProof(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1F2C] to-[#2d2b3a]">
      <div className="w-full max-w-md space-y-8 p-8 bg-[#292741]/90 backdrop-blur-lg rounded-xl shadow-2xl border border-[#9b87f5]/20">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/0aa7311a-71fc-4de3-b931-de22dfc1c9a5.png" 
            alt="Logo" 
            className="w-20 h-20 object-contain mb-2"
          />
          {currentStep === SignupStep.REGISTRATION && (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="mt-2 text-center text-gray-400">
                Join our community and find your perfect match
              </p>
            </>
          )}
          
          {currentStep === SignupStep.PAYMENT_INSTRUCTIONS && (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
                Payment Required
              </h2>
              <p className="mt-2 text-center text-gray-400">
                Please make a payment to activate your account
              </p>
            </>
          )}
          
          {currentStep === SignupStep.PROOF_OF_PAYMENT && (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
                Upload Payment Proof
              </h2>
              <p className="mt-2 text-center text-gray-400">
                Please upload a screenshot of your payment
              </p>
            </>
          )}
          
          {currentStep === SignupStep.CONFIRMATION && (
            <>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-purple-400 bg-clip-text text-transparent">
                Registration Complete
              </h2>
              <p className="mt-2 text-center text-gray-400">
                Your account is pending approval by an administrator
              </p>
            </>
          )}
        </div>

        {currentStep === SignupStep.REGISTRATION && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="text"
                            placeholder="Username"
                            className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white pl-4 h-12"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            className="bg-[#1e1c2e] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white pl-4 h-12"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        )}

        {currentStep === SignupStep.PAYMENT_INSTRUCTIONS && (
          <div className="space-y-6">
            <div className="bg-[#1e1c2e] p-6 rounded-lg border border-[#9b87f5]/30">
              <h3 className="text-xl font-semibold text-white mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Payment Method:</span>
                  <span className="font-medium">Mobile Money</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Account Number:</span>
                  <span className="font-medium text-[#9b87f5]">+1 234-567-8900</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Recipient Name:</span>
                  <span className="font-medium">Escorts Reloaded</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Amount:</span>
                  <span className="font-medium text-green-400">$49.99</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Reference:</span>
                  <span className="font-medium">{email.split('@')[0]}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-300 text-sm">
                <span className="font-semibold">Important:</span> After making the payment, you'll need to upload a screenshot as proof of payment.
              </p>
            </div>
            
            <Button 
              className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium"
              onClick={() => setCurrentStep(SignupStep.PROOF_OF_PAYMENT)}
            >
              I've Made the Payment
            </Button>
          </div>
        )}

        {currentStep === SignupStep.PROOF_OF_PAYMENT && (
          <div className="space-y-6">
            <div className="bg-[#1e1c2e] p-6 rounded-lg border border-[#9b87f5]/30">
              <label className="block mb-4 text-white">
                Upload Payment Screenshot
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-[#292741] border-[#9b87f5]/30 focus-visible:ring-[#9b87f5] focus-visible:border-[#9b87f5] text-white"
              />
              {selectedFile && (
                <div className="mt-4 p-3 bg-[#333150] rounded-lg">
                  <p className="text-gray-300 text-sm truncate">
                    <span className="font-medium">Selected file:</span> {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium"
              onClick={uploadProofOfPayment}
              disabled={!selectedFile || uploadingProof}
            >
              {uploadingProof ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              ) : (
                "Upload Proof of Payment"
              )}
            </Button>
          </div>
        )}

        {currentStep === SignupStep.CONFIRMATION && (
          <div className="space-y-6">
            <div className="bg-[#1e1c2e] p-6 rounded-lg border border-[#9b87f5]/30">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-[#9b87f5]/20 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9b87f5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-300">
                Thank you for your registration! An administrator will review your payment and activate your account soon. You'll be able to log in once your account is approved.
              </p>
            </div>
            
            <Button 
              className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-purple-500 hover:from-[#8b77e5] hover:to-purple-600 transition-all duration-300 text-white font-medium"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
        )}

        <div className="relative flex items-center justify-center mt-6">
          <div className="border-t border-gray-700 w-full"></div>
          <div className="bg-[#292741] px-4 text-sm text-gray-400 relative z-10">or</div>
          <div className="border-t border-gray-700 w-full"></div>
        </div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#9b87f5] hover:text-[#8b77e5] transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
