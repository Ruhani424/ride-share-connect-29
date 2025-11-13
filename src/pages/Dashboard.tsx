import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RatingDialog } from "@/components/RatingDialog";
import { Calendar, MapPin, Users, IndianRupee, Star, Clock, Navigation } from "lucide-react";

interface RideHistory {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  fare: number;
  status: "completed" | "upcoming" | "cancelled";
  type: "driver" | "passenger";
  rating?: number;
  driverName?: string;
  vehicleModel?: string;
}

const Dashboard = () => {
  const [rideHistory] = useState<RideHistory[]>([
    {
      id: "1",
      from: "Mumbai",
      to: "Pune",
      date: "2024-01-15",
      time: "09:00 AM",
      passengers: 3,
      fare: 450,
      status: "completed",
      type: "driver",
      rating: 4.8,
    },
    {
      id: "2",
      from: "Delhi",
      to: "Jaipur",
      date: "2024-01-20",
      time: "06:00 AM",
      passengers: 2,
      fare: 380,
      status: "completed",
      type: "passenger",
      driverName: "Raj Kumar",
      vehicleModel: "Honda City",
      rating: 4.5,
    },
    {
      id: "3",
      from: "Bangalore",
      to: "Mysore",
      date: "2024-01-25",
      time: "10:00 AM",
      passengers: 4,
      fare: 320,
      status: "upcoming",
      type: "driver",
    },
    {
      id: "4",
      from: "Chennai",
      to: "Pondicherry",
      date: "2024-01-10",
      time: "03:00 PM",
      passengers: 1,
      fare: 280,
      status: "cancelled",
      type: "passenger",
      driverName: "Arun Sharma",
      vehicleModel: "Maruti Swift",
    },
  ]);

  const completedRides = rideHistory.filter((ride) => ride.status === "completed");
  const upcomingRides = rideHistory.filter((ride) => ride.status === "upcoming");
  const totalEarnings = completedRides
    .filter((ride) => ride.type === "driver")
    .reduce((sum, ride) => sum + ride.fare * ride.passengers, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
        <div className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Rides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{rideHistory.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{completedRides.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{upcomingRides.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <IndianRupee className="h-6 w-6" />
                  {totalEarnings}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ride History Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Ride History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Rides</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {rideHistory.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-6">
                  {completedRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4 mt-6">
                  {upcomingRides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4 mt-6">
                  {rideHistory
                    .filter((ride) => ride.status === "cancelled")
                    .map((ride) => (
                      <RideCard key={ride.id} ride={ride} />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const RideCard = ({ ride }: { ride: RideHistory }) => {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  
  const statusColors = {
    completed: "bg-success text-success-foreground",
    upcoming: "bg-accent text-accent-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
  };

  return (
    <>
      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        rideId={ride.id}
        toUserId={ride.type === "passenger" ? "driver-user-id" : "passenger-user-id"}
        toUserName={ride.type === "passenger" ? ride.driverName || "Driver" : "Passenger"}
        userType={ride.type === "passenger" ? "driver" : "passenger"}
      />
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="font-semibold text-lg">
                {ride.from} → {ride.to}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {ride.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {ride.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {ride.passengers} passenger(s)
              </div>
            </div>
          </div>
          <Badge className={statusColors[ride.status]}>{ride.status}</Badge>
        </div>

        {ride.type === "passenger" && ride.driverName && (
          <div className="mb-3 text-sm">
            <span className="text-muted-foreground">Driver: </span>
            <span className="font-medium">{ride.driverName}</span>
            {ride.vehicleModel && (
              <>
                <span className="text-muted-foreground"> • </span>
                <span className="font-medium">{ride.vehicleModel}</span>
              </>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-lg font-bold">
              <IndianRupee className="h-5 w-5" />
              {ride.type === "driver" ? ride.fare * ride.passengers : ride.fare}
            </div>
            {ride.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{ride.rating}</span>
              </div>
            )}
          </div>
          {ride.status === "upcoming" && (
            <Link to={`/track/${ride.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Navigation className="h-4 w-4" />
                Track Ride
              </Button>
            </Link>
          )}
          {ride.status === "completed" && !ride.rating && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRatingDialog(true)}
            >
              Rate Ride
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default Dashboard;
