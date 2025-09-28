import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <Card className="p-12 text-center bg-card shadow-warm border-0 max-w-md">
        <h1 className="text-4xl-care font-bold text-card-foreground mb-4">404</h1>
        <p className="text-xl-care text-muted-foreground mb-8">
          Oops! This page doesn't exist
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2 text-lg px-8">
            <Home className="w-5 h-5" />
            Return Home
          </Button>
        </Link>
      </Card>
    </main>
  );
};

export default NotFound;
