import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Navigation, Clock, Phone, User, Car, ArrowLeft } from "lucide-react";

const TrackRide = () => {
  const { rideId } = useParams();
  const [driverLocation, setDriverLocation] = useState({
    lat: 19.076,
    lng: 72.8777,
  });
  const [eta, setEta] = useState("15 mins");

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
      
      // Simulate ETA countdown
      const minutes = Math.max(1, parseInt(eta) - 1);
      setEta(`${minutes} mins`);
    }, 5000);

    return () => clearInterval(interval);
  }, [eta]);

  const rideDetails = {
    id: rideId,
    from: "Mumbai Central",
    to: "Pune Station",
    driverName: "Raj Kumar",
    driverPhone: "+91 98765 43210",
    vehicleModel: "Honda City",
    vehicleNumber: "MH 01 AB 1234",
    driverRating: 4.8,
    status: "on-the-way",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
        <div className="container mx-auto px-4 py-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-primary" />
                      Live Tracking
                    </CardTitle>
                    <Badge className="bg-success text-success-foreground">
                      Driver En Route
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Map placeholder - In production, integrate Google Maps or Mapbox */}
                  <div className="relative h-[500px] bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="relative w-64 h-64 mx-auto">
                          {/* Animated map visualization */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Car className="h-12 w-12 text-primary animate-bounce" />
                          </div>
                          {/* Route line */}
                          <div className="absolute top-1/4 left-1/2 w-0.5 h-1/2 bg-primary/50" />
                          <MapPin className="absolute top-[10%] left-1/2 -translate-x-1/2 h-8 w-8 text-success" />
                          <MapPin className="absolute bottom-[10%] left-1/2 -translate-x-1/2 h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">Driver Location</p>
                          <p className="text-sm text-muted-foreground">
                            Lat: {driverLocation.lat.toFixed(4)}, Lng: {driverLocation.lng.toFixed(4)}
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            * In production, this will show an interactive map with real GPS tracking
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ETA Card */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Time of Arrival</p>
                        <p className="text-3xl font-bold text-primary">{eta}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Distance Remaining</p>
                      <p className="text-xl font-semibold">12.5 km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ride Details Sidebar */}
            <div className="space-y-6">
              {/* Trip Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Trip Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Pickup</p>
                        <p className="font-medium">{rideDetails.from}</p>
                      </div>
                    </div>
                    <div className="h-8 w-0.5 bg-border ml-2" />
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Drop-off</p>
                        <p className="font-medium">{rideDetails.to}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{rideDetails.driverName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="text-warning">★</span>
                        <span>{rideDetails.driverRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{rideDetails.vehicleModel}</p>
                        <p className="text-sm text-muted-foreground">{rideDetails.vehicleNumber}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gap-2 mt-4" size="lg">
                    <Phone className="h-4 w-4" />
                    Call Driver
                  </Button>
                </CardContent>
              </Card>

              {/* Safety Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Safety Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Share Trip Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Emergency Contact
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackRide;
