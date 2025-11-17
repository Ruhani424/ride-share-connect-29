import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Car, Users, Shield, Clock, MapPin, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Travel Together,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Save Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share rides, split costs, and make new friends. The smart way to travel across India.
            </p>

            {/* Quick Search */}
            <Card className="max-w-3xl mx-auto shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      From
                    </label>
                    <Input placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      To
                    </label>
                    <Input placeholder="Pune" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Date
                    </label>
                    <Input type="date" />
                  </div>
                </div>
                <Link to="/search" className="block mt-4">
                  <Button className="w-full bg-purple-700 text-white hover:bg-purple-500" size="lg">
                    Search Rides
                    
                  </Button>
                </Link>
                <div className="text-center mt-4 ">
                  <Link to="/offer-ride">
                    <Button className="w-full bg-purple-700 text-white hover:bg-purple-500" size="lg">
                      Offer ride
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose GoTogether?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the safest and most convenient carpooling service in India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Safe & Verified</h3>
                <p className="text-sm text-muted-foreground">
                  All drivers are verified with license and documents
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with verified travelers and build trust
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Affordable Travel</h3>
                <p className="text-sm text-muted-foreground">
                  Save up to 70% compared to traditional transport
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold text-lg">Instant Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Book rides in seconds with instant confirmation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">Simple steps to start your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <h3 className="font-semibold text-xl">Search or Offer</h3>
              <p className="text-muted-foreground">
                Search for available rides or offer your own ride to fellow travelers
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <h3 className="font-semibold text-xl">Book & Pay</h3>
              <p className="text-muted-foreground">
                Choose your ride, confirm booking, and make secure payment online
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <h3 className="font-semibold text-xl">Travel Together</h3>
              <p className="text-muted-foreground">
                Meet at the pickup point and enjoy a comfortable, shared journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who save money and reduce their carbon footprint
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                Browse Rides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
