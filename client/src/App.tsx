import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { ZodiacSign, SubscriptionStatus, SubscriptionTier } from "@shared/types";

// New pages
import AboutPage from "@/pages/AboutPage";
import SciencePage from "@/pages/SciencePage";
import ContactPage from "@/pages/ContactPage";
import AffiliateMarketplace from "@/pages/AffiliateMarketplace";
import ZodiacLibrary from "@/pages/ZodiacLibrary";

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  zodiacSign: ZodiacSign;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  subscriptionEndDate?: string;
}

// Router component to handle navigation
function Router() {
  const [user, setUser] = useState<UserData | null>(null);

  // On mount, check localStorage for existing user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const isLoggedIn = !!user?.email && !!user?.zodiacSign;
  const isPremium = user?.subscriptionTier === 'premium' && user?.subscriptionStatus === 'active';

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar 
        isLoggedIn={isLoggedIn} 
        userEmail={user?.email || ""} 
        userZodiacSign={user?.zodiacSign}
        isPremium={isPremium}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/about" component={AboutPage} />
          <Route path="/science" component={SciencePage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/marketplace" component={AffiliateMarketplace} />
          <Route path="/zodiac-library" component={ZodiacLibrary} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;