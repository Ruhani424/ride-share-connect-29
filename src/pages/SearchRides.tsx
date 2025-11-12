import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Star, Shield, Car } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sampleRides } from "@/data/sampleRides";

const SearchRides = () => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    date: "",
  });

  const filteredRides = sampleRides.filter((ride) => {
    const matchFrom = !filters.from || ride.from.toLowerCase().includes(filters.from.toLowerCase());
    const matchTo = !filters.to || ride.to.toLowerCase().includes(filters.to.toLowerCase());
    const matchDate = !filters.date || ride.date === filters.date;
    return matchFrom && matchTo && matchDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Search for Rides</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  placeholder="Mumbai"
                  value={filters.from}
                  onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Pune"
                  value={filters.to}
                  onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Search</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {filteredRides.length} ride{filteredRides.length !== 1 ? "s" : ""} found
          </h3>
        </div>

        {/* Ride Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRides.map((ride) => (
            <Card key={ride.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Driver Info */}
                  <div className="lg:col-span-3 flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl text-primary-foreground font-bold">
                      {ride.driverName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{ride.driverName}</h4>
                      <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-warning text-warning mr-1" />
                        <span>{ride.driverRating}</span>
                      </div>
                      {ride.verified && (
                        <Badge variant="secondary" className="mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{ride.from}</div>
                        <div className="text-sm text-muted-foreground">→</div>
                        <div className="font-semibold">{ride.to}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ride.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div>{ride.time}</div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {ride.vehicleMake} {ride.vehicleModel} • {ride.vehicleNumber}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ride.preferences.map((pref, idx) => (
                        <Badge key={idx} variant="outline">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price & Booking */}
                  <div className="lg:col-span-4 flex flex-col justify-between items-end space-y-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">₹{ride.price}</div>
                      <div className="text-sm text-muted-foreground">per person</div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {ride.seatsAvailable} seat{ride.seatsAvailable !== 1 ? "s" : ""} available
                      </span>
                    </div>

                    <Link to={`/book/${ride.id}`} className="w-full">
                      <Button className="w-full" size="lg">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground space-y-2">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No rides found</h3>
              <p>Try adjusting your search filters or check back later</p>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchRides;
