import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users } from "lucide-react";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <header className="mb-12">
          <h1 className="text-4xl-care font-bold text-primary-foreground mb-4 drop-shadow-soft">
            Welcome to RememberMe
          </h1>
          <p className="text-xl-care text-primary-foreground/90 font-medium">
            A caring companion for memory and family connection
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-warm border-0 hover:shadow-comfort transition-all duration-500 group">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Heart className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl-care font-semibold text-card-foreground mb-4">
                Patient Mode
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Simple, caring interface to help reconnect with family memories
              </p>
              <Link to="/patient">
                <Button 
                  size="lg"
                  className="w-full text-xl-care py-6 bg-primary hover:bg-primary/90 shadow-warm hover:shadow-comfort transition-all duration-300"
                >
                  Start Patient Mode
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-warm border-0 hover:shadow-comfort transition-all duration-500 group">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Users className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h2 className="text-2xl-care font-semibold text-card-foreground mb-4">
                Family Setup
              </h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Add family members and create loving memories to share
              </p>
              <Link to="/family">
                <Button 
                  variant="secondary"
                  size="lg"
                  className="w-full text-xl-care py-6 shadow-soft hover:shadow-warm transition-all duration-300"
                >
                  Manage Family
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <footer className="text-primary-foreground/80 text-lg">
          <p>Made with ❤️ for families facing memory challenges</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;