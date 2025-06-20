import { Switch, Route, useLocation, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { ZodiacSign, SubscriptionStatus, SubscriptionTier } from "@shared/types";
import { NavigationBar } from "@/components/NavigationBar";
import { Footer } from "@/components/Footer";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/context/LanguageContext";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
import PremiumPage from "@/pages/PremiumPage";
import AchievementsPage from "@/pages/AchievementsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import SavedTipsPage from "@/pages/SavedTipsPage";
import GiftPage from "@/pages/GiftPage";
import FAQPage from "@/pages/FAQPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import HoroscopeDetailPage from "@/pages/HoroscopeDetailPage";

// Community pages
import CommunityHome from "@/pages/community/CommunityHome";
import Forum from "@/pages/community/Forum";
import NewTopic from "@/pages/community/NewTopic";
import TopicDetail from "@/pages/community/TopicDetail";

// Admin pages
import AdminDashboard from "@/pages/admin";
import AdminAnalytics from "@/pages/admin/analytics";
import CRMDashboard from "@/pages/admin/CRMDashboard";

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
  firstName?: string | null;
  lastName?: string | null;
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
        <PageTransition loading={logoutMutation.isPending}>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/auth">
              <AuthPage />
            </Route>
            <Route path="/onboarding">
              <OnboardingPage />
            </Route>
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <Route path="/zodiac-library">
              <ZodiacLibrary />
            </Route>
            <Route path="/elements">
              <ElementsGuide />
            </Route>
            <Route path="/marketplace">
              <AffiliateMarketplace user={user} />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/science">
              <SciencePage />
            </Route>
            <Route path="/contact">
              <ContactPage />
            </Route>
            <Route path="/premium">
              <PremiumPage />
            </Route>
            <ProtectedRoute path="/achievements" component={AchievementsPage} />
            <Route path="/wellness-tips">
              <SavedTipsPage />
            </Route>
            <Route path="/gift">
              <GiftPage />
            </Route>
            <Route path="/faq">
              <FAQPage />
            </Route>
            <Route path="/privacy">
              <PrivacyPage />
            </Route>
            <Route path="/terms">
              <TermsPage />
            </Route>
            <Route path="/horoscope/:sign">
              <HoroscopeDetailPage />
            </Route>
            
            {/* Community Routes */}
            <Route path="/community">
              <CommunityHome />
            </Route>
            <Route path="/community/:sign">
              <Forum />
            </Route>
            <Route path="/community/:sign/new-topic">
              <NewTopic />
            </Route>
            <Route path="/community/:sign/topics/:topicId">
              <TopicDetail />
            </Route>
            
            {/* Admin Routes */}
            <ProtectedRoute path="/admin" component={AdminDashboard} />
            <ProtectedRoute path="/admin/analytics" component={AdminAnalytics} />
            <ProtectedRoute path="/admin/crm" component={CRMDashboard} />
            
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </PageTransition>
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
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;