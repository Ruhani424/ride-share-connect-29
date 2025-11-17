import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OfferRide = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: "",
    price: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleNumber: "",
    notes: "",
    noSmoking: false,
    musicOk: false,
    ac: false,
    petsOk: false,
    luggage: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.seats || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate seats
    const seatsNum = parseInt(formData.seats);
    if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 6) {
      toast({
        title: "Error",
        description: "Available seats must be between 1 and 6",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate price
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast({
        title: "Error",
        description: "Price must be a positive number",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to post a ride",
          variant: "destructive",
        });
        setIsLoading(false);
        navigate("/auth");
        return;
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("create-ride", {
        body: {
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time,
          seats: formData.seats,
          price: formData.price,
          vehicleMake: formData.vehicleMake,
          vehicleModel: formData.vehicleModel,
          vehicleNumber: formData.vehicleNumber,
          notes: formData.notes,
          noSmoking: formData.noSmoking,
          musicOk: formData.musicOk,
          ac: formData.ac,
          petsOk: formData.petsOk,
          luggage: formData.luggage,
        },
      });

      if (error) {
        console.error("Error creating ride:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to post ride. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        toast({
          title: "Ride Posted Successfully!",
          description: "Your ride is now visible to passengers",
        });

        // Reset form
        setFormData({
          from: "",
          to: "",
          date: "",
          time: "",
          seats: "",
          price: "",
          vehicleMake: "",
          vehicleModel: "",
          vehicleNumber: "",
          notes: "",
          noSmoking: false,
          musicOk: false,
          ac: false,
          petsOk: false,
          luggage: false,
        });

        // Navigate to search page
        setTimeout(() => {
          navigate("/search");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: "Failed to post ride. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Offer a Ride</CardTitle>
            <CardDescription>Share your journey and help fellow travelers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Route Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From *</Label>
                    <Input
                      id="from"
                      placeholder="Mumbai"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To *</Label>
                    <Input
                      id="to"
                      placeholder="Pune"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      disabled={isLoading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Departure Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">Available Seats *</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      max="6"
                      placeholder="3"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Seat (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="350"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Make</Label>
                    <Input
                      id="vehicleMake"
                      placeholder="Honda"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      id="vehicleModel"
                      placeholder="City"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Number</Label>
                    <Input
                      id="vehicleNumber"
                      placeholder="MH 01 AB 1234"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noSmoking"
                      checked={formData.noSmoking}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, noSmoking: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="noSmoking" className="text-sm font-medium">
                      No Smoking
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="musicOk"
                      checked={formData.musicOk}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, musicOk: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="musicOk" className="text-sm font-medium">
                      Music OK
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ac"
                      checked={formData.ac}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, ac: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="ac" className="text-sm font-medium">
                      AC Available
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="petsOk"
                      checked={formData.petsOk}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, petsOk: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="petsOk" className="text-sm font-medium">
                      Pets OK
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="luggage"
                      checked={formData.luggage}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, luggage: checked as boolean })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="luggage" className="text-sm font-medium">
                      Luggage Space
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information for passengers..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Posting Ride..." : "Post Ride"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default OfferRide;