import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, Clock, FileText, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DriverVerification {
  id: string;
  user_id: string;
  license_number: string;
  license_image_url: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_number: string | null;
  years_experience: number | null;
  status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    phone: string | null;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifications, setVerifications] = useState<DriverVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      fetchVerifications();
    } catch (error) {
      navigate("/login");
    }
  };

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("driver_verifications")
        .select(`
          *,
          profiles (
            full_name,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch verifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (verificationId: string, userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("driver_verifications")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          verified_by: user?.id,
        })
        .eq("id", verificationId);

      if (error) throw error;

      toast({
        title: "Driver Verified",
        description: "The driver has been successfully verified",
      });

      fetchVerifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify driver",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (verificationId: string) => {
    const reason = rejectionReason[verificationId];
    
    if (!reason?.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("driver_verifications")
        .update({
          status: "rejected",
          rejection_reason: reason,
        })
        .eq("id", verificationId);

      if (error) throw error;

      toast({
        title: "Driver Rejected",
        description: "The verification has been rejected",
      });

      setRejectionReason({ ...rejectionReason, [verificationId]: "" });
      fetchVerifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject verification",
        variant: "destructive",
      });
    }
  };

  const statusColors = {
    pending: "bg-warning text-warning-foreground",
    verified: "bg-success text-success-foreground",
    rejected: "bg-destructive text-destructive-foreground",
  };

  const statusIcons = {
    pending: Clock,
    verified: CheckCircle,
    rejected: XCircle,
  };

  const filteredVerifications = (status: string) =>
    status === "all"
      ? verifications
      : verifications.filter((v) => v.status === status);

  const VerificationCard = ({ verification }: { verification: DriverVerification }) => {
    const StatusIcon = statusIcons[verification.status];

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {verification.profiles?.full_name || "Unknown Driver"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {verification.profiles?.phone || "No phone"}
              </p>
            </div>
            <Badge className={statusColors[verification.status]}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {verification.status}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">License:</span>
              <span>{verification.license_number}</span>
            </div>
            {verification.vehicle_make && (
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Vehicle:</span>
                <span>
                  {verification.vehicle_make} {verification.vehicle_model} -{" "}
                  {verification.vehicle_number}
                </span>
              </div>
            )}
            {verification.years_experience && (
              <div className="text-sm">
                <span className="font-medium">Experience:</span>{" "}
                {verification.years_experience} years
              </div>
            )}
          </div>

          {verification.license_image_url && (
            <div className="mb-4">
              <img
                src={verification.license_image_url}
                alt="License"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {verification.status === "rejected" && verification.rejection_reason && (
            <div className="mb-4 p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive font-medium">Rejection Reason:</p>
              <p className="text-sm">{verification.rejection_reason}</p>
            </div>
          )}

          {verification.status === "pending" && (
            <div className="space-y-3">
              <Textarea
                placeholder="Reason for rejection (if rejecting)..."
                value={rejectionReason[verification.id] || ""}
                onChange={(e) =>
                  setRejectionReason({
                    ...rejectionReason,
                    [verification.id]: e.target.value,
                  })
                }
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReject(verification.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleVerify(verification.id, verification.user_id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage driver verifications and approvals
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Driver Verifications</CardTitle>
              <CardDescription>
                Review and approve or reject driver verification requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All ({verifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({filteredVerifications("pending").length})
                  </TabsTrigger>
                  <TabsTrigger value="verified">
                    Verified ({filteredVerifications("verified").length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({filteredVerifications("rejected").length})
                  </TabsTrigger>
                </TabsList>

                {["all", "pending", "verified", "rejected"].map((status) => (
                  <TabsContent key={status} value={status} className="space-y-4 mt-6">
                    {isLoading ? (
                      <p className="text-center text-muted-foreground">Loading...</p>
                    ) : filteredVerifications(status).length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No {status !== "all" ? status : ""} verifications found
                      </p>
                    ) : (
                      filteredVerifications(status).map((verification) => (
                        <VerificationCard
                          key={verification.id}
                          verification={verification}
                        />
                      ))
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
