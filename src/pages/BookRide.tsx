import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, Star, Shield, Car, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sampleRides } from "@/data/sampleRides";
import { useToast } from "@/hooks/use-toast";

const BookRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ride = sampleRides.find((r) => r.id === rideId);

  const [bookingData, setBookingData] = useState({
    seats: 1,
    name: "",
    phone: "",
    email: "",
  });

  if (!ride) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ride not found</h2>
          <Button onClick={() => navigate("/search")}>Back to Search</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const platformFee = 20;
  const tax = Math.round((ride.price * bookingData.seats + platformFee) * 0.18);
  const totalAmount = ride.price * bookingData.seats + platformFee + tax;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingData.name || !bookingData.phone || !bookingData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (bookingData.seats > ride.seatsAvailable) {
      toast({
        title: "Error",
        description: `Only ${ride.seatsAvailable} seats available`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Processing",
      description: "Redirecting to payment gateway...",
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Payment successful! Your ride has been booked. Redirecting to tracking...",
      });
      
      setTimeout(() => {
        navigate(`/track/${rideId}`);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        min={1}
                        max={ride.seatsAvailable}
                        value={bookingData.seats}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, seats: parseInt(e.target.value) || 1 })
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        {ride.seatsAvailable} seats available
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Payment
                  </Button>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-3">Payment Options</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors">
                        <input type="radio" name="payment" id="card" defaultChecked />
                        <label htmlFor="card" className="flex-1 cursor-pointer">
                          Credit/Debit Card
                        </label>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors">
                        <input type="radio" name="payment" id="upi" />
                        <label htmlFor="upi" className="flex-1 cursor-pointer">
                          UPI
                        </label>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors">
                        <input type="radio" name="payment" id="wallet" />
                        <label htmlFor="wallet" className="flex-1 cursor-pointer">
                          Wallet
                        </label>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors">
                        <input type="radio" name="payment" id="cash" />
                        <label htmlFor="cash" className="flex-1 cursor-pointer">
                          Cash
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      🔒 Secure payment gateway powered by Stripe
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ride Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ride Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Driver */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xl text-primary-foreground font-bold">
                    {ride.driverName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{ride.driverName}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-warning text-warning mr-1" />
                      <span>{ride.driverRating}</span>
                      {ride.verified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Route */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm">{ride.from}</div>
                      <div className="text-xs text-muted-foreground">→</div>
                      <div className="font-semibold text-sm">{ride.to}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(ride.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} at {ride.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4" />
                    <span>{ride.vehicleMake} {ride.vehicleModel}</span>
                  </div>
                </div>

                <Separator />

                {/* Preferences */}
                <div>
                  <div className="text-sm font-medium mb-2">Preferences</div>
                  <div className="flex flex-wrap gap-2">
                    {ride.preferences.map((pref, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ride fare ({bookingData.seats} seat{bookingData.seats > 1 ? 's' : ''})</span>
                    <span>₹{ride.price * bookingData.seats}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookRide;
