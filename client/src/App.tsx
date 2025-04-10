import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { ZodiacSign, SubscriptionStatus, SubscriptionTier } from "@shared/types";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import all pages
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import ZodiacLibrary from "@/pages/ZodiacLibrary";
import ElementsGuide from "@/pages/ElementsGuide";
import AffiliateMarketplace from "@/pages/AffiliateMarketplace";
import AboutPage from "@/pages/AboutPage";
import SciencePage from "@/pages/SciencePage";
import ContactPage from "@/pages/ContactPage";
import AuthPage from "@/pages/auth-page";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

function AppContent() {
  const { user, logoutMutation } = useAuth();
  
  const isLoggedIn = !!user;
  const isPremium = !!user?.isPremium;
  
  const handleLogout = () => {
    logoutMutation.mutate();
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
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/zodiac-library" component={ZodiacLibrary} />
          <Route path="/elements" component={ElementsGuide} />
          <Route path="/marketplace" component={AffiliateMarketplace} />
          <Route path="/about" component={AboutPage} />
          <Route path="/science" component={SciencePage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;