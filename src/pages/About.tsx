import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Leaf, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About GoTogether</h1>
          <p className="text-xl text-muted-foreground">
            We're on a mission to make travel affordable, sustainable, and social across India.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To connect travelers and reduce the environmental impact of transportation while making
                travel more affordable and social. We believe in the power of shared journeys to bring
                people together and create positive change.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To become India's most trusted carpooling platform, making shared travel the first choice
                for millions of people. We envision a future where every empty seat is an opportunity to
                connect, save money, and protect our planet.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Safety First</h3>
                <p className="text-sm text-muted-foreground">
                  Verified drivers and secure payments for peace of mind
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building connections between travelers across India
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  Reducing carbon emissions through shared rides
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Trust</h3>
                <p className="text-sm text-muted-foreground">
                  Transparency and reliability in every journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl p-12 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-sm opacity-90">Rides Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Cities Connected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8★</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              GoTogether was born from a simple observation: millions of empty car seats travel across
              India every day, while millions of people struggle with expensive and uncomfortable travel
              options. We saw an opportunity to solve both problems at once.
            </p>
            <p>
              Founded in 2024 by a team of passionate travelers and technologists, we started with a
              vision to make carpooling safe, reliable, and accessible to everyone. Today, we're proud to
              be India's fastest-growing carpooling platform, connecting thousands of drivers and
              passengers every day.
            </p>
            <p>
              But we're just getting started. Every ride shared on our platform is a step towards a more
              connected, sustainable, and affordable India. Join us on this journey!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
