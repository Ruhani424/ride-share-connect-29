import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      toast({
        title: "Error",
        description: "Email not found. Please sign up again.",
        variant: "destructive",
      });
      navigate("/signup");
    }
  }, [searchParams, navigate, toast]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Verify OTP in database
      const { data: verification, error: verifyError } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("email", email)
        .eq("otp", otp)
        .eq("verified", false)
        .gte("expires_at", new Date().toISOString())
        .single();

      if (verifyError || !verification) {
        toast({
          title: "Invalid OTP",
          description: "The OTP is invalid or has expired",
          variant: "destructive",
        });
        return;
      }

      // Mark as verified
      await supabase
        .from("email_verifications")
        .update({ verified: true })
        .eq("id", verification.id);

      toast({
        title: "Email verified!",
        description: "Your email has been verified successfully. You can now login.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify email",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Failed to resend OTP");

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto bg-gradient-to-br from-primary to-secondary p-3 rounded-xl w-fit">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to {email}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Email"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-primary hover:underline font-medium"
              >
                Resend OTP
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
