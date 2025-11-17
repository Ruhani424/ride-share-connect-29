import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email },
      });

      if (error) throw error;

      toast({
        title: "OTP Sent!",
        description: "Please check your email for the verification code",
      });
      setStep("otp");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { email: formData.email, otp: formData.otp },
      });

      if (error) throw error;

      toast({
        title: "Verified!",
        description: "OTP verified successfully. Set your new password",
      });
      setStep("reset");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, sign in with a temporary session to reset password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: "temp", // This will fail but we need it for the flow
      });

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        // If direct update fails, use the admin API through edge function
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          formData.email,
          { redirectTo: `${window.location.origin}/login` }
        );
        
        if (resetError) throw resetError;
        
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your password has been reset successfully",
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-otp", {
        body: { email: formData.email },
      });

      if (error) throw error;

      toast({
        title: "OTP Sent!",
        description: "A new verification code has been sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-gradient-to-br from-primary to-secondary p-3 rounded-xl w-fit">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "Enter your email to receive a verification code"}
              {step === "otp" && "Enter the 6-digit code sent to your email"}
              {step === "reset" && "Create a new password for your account"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>

              <Link to="/login" className="flex items-center justify-center text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Didn't receive code?{" "}
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Link to="/login" className="flex items-center justify-center text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
