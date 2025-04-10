import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/context/UserContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZodiacSign } from '@shared/types';
import { getZodiacBySign } from '@/utils/zodiac';
import { apiRequest } from '@/lib/queryClient';

// Dashboard component for logged-in users
const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const [horoscope, setHoroscope] = useState<any>(null);
  const [isLoadingHoroscope, setIsLoadingHoroscope] = useState(false);

  // Fetch today's horoscope for the user
  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!user?.zodiacSign) return;
      
      setIsLoadingHoroscope(true);
      try {
        const res = await fetch(`/api/horoscope/${user.zodiacSign}`);
        const data = await res.json();
        
        if (data.success) {
          setHoroscope(data);
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
      } finally {
        setIsLoadingHoroscope(false);
      }
    };
    
    if (user?.isAuthenticated) {
      fetchHoroscope();
    }
  }, [user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user?.isAuthenticated) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl text-indigo-900 animate-spin mb-4">
            <i className="fas fa-spinner"></i>
          </div>
          <p>Loading your cosmic dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated) {
    return null; // Will redirect via the effect
  }

  const zodiacInfo = user.zodiacSign 
    ? getZodiacBySign(user.zodiacSign as ZodiacSign)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-playfair font-bold">
              Welcome{user.firstName ? `, ${user.firstName}` : ''}
            </h1>
            <p className="text-gray-600 mt-2">
              Here's your personalized health guidance for today.
            </p>
          </div>
          
          <Tabs defaultValue="horoscope" className="mb-8">
            <TabsList>
              <TabsTrigger value="horoscope">Today's Horoscope</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="horoscope" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center">
                      {zodiacInfo && (
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mr-3">
                          <i className={`fas fa-${zodiacInfo.icon}`}></i>
                        </div>
                      )}
                      <div>
                        <CardTitle>
                          Your {zodiacInfo?.name || ''} Health Horoscope
                        </CardTitle>
                        <CardDescription>
                          {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoadingHoroscope ? (
                      <div className="py-10 text-center">
                        <div className="text-2xl text-indigo-900 animate-spin mb-4">
                          <i className="fas fa-spinner"></i>
                        </div>
                        <p>Reading the stars for you...</p>
                      </div>
                    ) : horoscope ? (
                      <div className="space-y-4">
                        <p className="text-lg">{horoscope.content.overview}</p>
                        
                        <div className="flex flex-wrap gap-2 my-4">
                          {horoscope.content.wellnessCategories.map((category: string, index: number) => (
                            <span 
                              key={index} 
                              className="rounded-full px-3 py-1 text-xs font-semibold bg-teal-100 text-teal-600"
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-medium text-indigo-900 mb-2">Today's Health Tip</h3>
                          <p>{horoscope.content.healthTip}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-medium text-indigo-900 mb-2">Nutrition Focus</h3>
                          <p>{horoscope.content.nutritionFocus}</p>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-medium text-indigo-900 mb-2">Element Alignment</h3>
                          <div className="flex items-center">
                            <div className="text-teal-600 mr-2">
                              <i className="fas fa-water"></i>
                            </div>
                            <p>{horoscope.content.elementAlignment}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <p>No horoscope available. Please check back later.</p>
                        <Button 
                          className="mt-4 bg-gradient-to-r from-teal-600 to-teal-400"
                          onClick={() => window.location.reload()}
                        >
                          Refresh
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Wellness Insights</CardTitle>
                    <CardDescription>
                      Get ready for these cosmic alignments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-3">
                        <p className="font-medium">Tomorrow</p>
                        <p className="text-sm text-gray-600">
                          The moon enters your wellness sector, bringing focus to self-care
                        </p>
                      </div>
                      <div className="border-b pb-3">
                        <p className="font-medium">This Week</p>
                        <p className="text-sm text-gray-600">
                          Mercury retrograde ends, helping you communicate health needs clearly
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">This Month</p>
                        <p className="text-sm text-gray-600">
                          Venus in your sign brings harmony to your health routines
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Your personalized settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p>{user.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Zodiac Sign</h3>
                        <p>{zodiacInfo?.name || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">SMS Notifications</h3>
                        <p>{user.smsOptIn ? 'Enabled' : 'Disabled'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p>{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Delivery Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Daily Email</span>
                          <Button variant="outline" size="sm">
                            {user.newsletterOptIn ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>SMS Alerts</span>
                          <Button variant="outline" size="sm">
                            {user.smsOptIn ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Horoscope History</CardTitle>
                  <CardDescription>
                    Your previous daily horoscopes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      Your past horoscopes will appear here as you use the service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
