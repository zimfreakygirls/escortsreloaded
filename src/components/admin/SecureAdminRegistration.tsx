import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Shield, AlertTriangle } from "lucide-react";
import { sanitizeInput, isValidEmail, isStrongPassword, rateLimiter, logSecurityEvent } from "@/utils/security";

interface SecureAdminRegistrationProps {
  onRegistrationComplete?: () => void;
}

export function SecureAdminRegistration({ onRegistrationComplete }: SecureAdminRegistrationProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const validateForm = (): string | null => {
    if (!isValidEmail(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!isStrongPassword(formData.password)) {
      return "Password must be at least 8 characters with uppercase, lowercase, and number.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.adminCode.trim()) {
      return "Admin registration code is required.";
    }

    return null;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    const clientId = `admin_reg_${formData.email}`;
    if (!rateLimiter.checkAttempt(clientId, 3, 10 * 60 * 1000)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientId) / 1000 / 60);
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${remainingTime} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Verify admin code
      const { data: adminSettings } = await supabase
        .from('admin_settings')
        .select('signup_code, signup_enabled')
        .eq('id', 'default')
        .single();

      if (!adminSettings?.signup_enabled) {
        logSecurityEvent('admin_registration_disabled_attempt', { email: formData.email });
        throw new Error("Admin registration is currently disabled.");
      }

      if (formData.adminCode !== adminSettings.signup_code) {
        logSecurityEvent('admin_registration_invalid_code', { email: formData.email });
        throw new Error("Invalid admin registration code.");
      }

      // Create admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-login`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add to admin_users table
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert({ id: authData.user.id });

        if (adminError) throw adminError;

        logSecurityEvent('admin_registration_success', { 
          email: formData.email,
          userId: authData.user.id 
        });

        toast({
          title: "Registration Successful",
          description: "Admin account created successfully. Please check your email to verify your account.",
        });

        setFormData({ email: "", password: "", confirmPassword: "", adminCode: "" });
        onRegistrationComplete?.();
      }
    } catch (error: any) {
      console.error("Admin registration error:", error);
      logSecurityEvent('admin_registration_failed', { 
        email: formData.email,
        error: error.message 
      });
      
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create admin account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background/95 backdrop-blur">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Admin Registration</CardTitle>
        <CardDescription>
          Create a new administrator account with secure credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium">Security Requirements:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Use a unique, strong password</li>
                <li>• Valid admin registration code required</li>
                <li>• Email verification mandatory</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Admin Registration Code"
              value={formData.adminCode}
              onChange={(e) => handleInputChange("adminCode", e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}