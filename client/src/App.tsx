import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { ZodiacSign, SubscriptionStatus, SubscriptionTier } from "@shared/types";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";

// Import all pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import ZodiacLibrary from "@/pages/ZodiacLibrary";
import AffiliateMarketplace from "@/pages/AffiliateMarketplace";
import AboutPage from "@/pages/AboutPage";
import SciencePage from "@/pages/SciencePage";
import ContactPage from "@/pages/ContactPage";

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  zodiacSign: ZodiacSign;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionTier?: SubscriptionTier;
  subscriptionEndDate?: string;
}

// Custom wrapper component to pass props to route components
function RouteWithProps({ component: Component, ...rest }: any) {
  const [user, setUser] = useState<UserData | null>(null);
  const [, navigate] = useLocation();

  // Load user data from localStorage
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
  
  const handleUserRegistered = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <Component 
      user={user} 
      isLoggedIn={isLoggedIn} 
      onUserRegistered={handleUserRegistered} 
      {...rest} 
    />
  );
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsPremium(userData.subscriptionTier === 'premium' && userData.subscriptionStatus === 'active');
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const isLoggedIn = !!user?.email && !!user?.zodiacSign;
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsPremium(false);
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
          <Route path="/">
            {(params) => <RouteWithProps component={Home} params={params} />}
          </Route>
          <Route path="/dashboard">
            {(params) => <RouteWithProps component={Dashboard} params={params} />}
          </Route>
          <Route path="/zodiac-library">
            {(params) => <RouteWithProps component={ZodiacLibrary} params={params} />}
          </Route>
          <Route path="/marketplace">
            {(params) => <RouteWithProps component={AffiliateMarketplace} params={params} />}
          </Route>
          <Route path="/about">
            {(params) => <RouteWithProps component={AboutPage} params={params} />}
          </Route>
          <Route path="/science">
            {(params) => <RouteWithProps component={SciencePage} params={params} />}
          </Route>
          <Route path="/contact">
            {(params) => <RouteWithProps component={ContactPage} params={params} />}
          </Route>
          <Route>
            {(params) => <RouteWithProps component={NotFound} params={params} />}
          </Route>
        </Switch>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;