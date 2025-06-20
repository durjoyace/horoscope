import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, MessageSquare, Send, CheckCircle, XCircle } from "lucide-react";

export default function TestSMSPage() {
  const [testPhone, setTestPhone] = useState("+15551234567");
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  // Test user creation with SMS opt-in
  const createTestUserMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/signup', {
        email: `smstest${Date.now()}@example.com`,
        firstName: 'SMS',
        lastName: 'Tester',
        phone: testPhone,
        zodiacSign: 'scorpio',
        smsOptIn: true,
        emailOptIn: false
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(prev => [...prev, {
        test: 'User Creation',
        result: data.success ? 'PASS' : 'FAIL',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      toast({
        title: data.success ? "User Created" : "Creation Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error: any) => {
      setTestResults(prev => [...prev, {
        test: 'User Creation',
        result: 'ERROR',
        message: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  });

  // Test horoscope generation
  const generateHoroscopesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/generate-horoscopes', {
        date: new Date().toISOString().split('T')[0]
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(prev => [...prev, {
        test: 'Horoscope Generation',
        result: data.success ? 'PASS' : 'FAIL',
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  });

  // Test SMS delivery
  const deliverHoroscopesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/deliver-horoscope', {
        date: new Date().toISOString().split('T')[0]
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTestResults(prev => [...prev, {
        test: 'SMS Delivery',
        result: data.success ? 'PASS' : 'FAIL',
        message: data.message || `Delivered to ${data.deliveredCount || 0} users`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      toast({
        title: "SMS Delivery Test",
        description: data.message || `Attempted delivery to users`,
      });
    }
  });

  const runFullTest = async () => {
    setTestResults([]);
    
    // Step 1: Create test user
    await createTestUserMutation.mutateAsync();
    
    // Step 2: Generate horoscopes
    setTimeout(async () => {
      await generateHoroscopesMutation.mutateAsync();
      
      // Step 3: Deliver horoscopes via SMS
      setTimeout(async () => {
        await deliverHoroscopesMutation.mutateAsync();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            SMS Integration Test
          </h1>
          <p className="text-gray-400 mt-1">
            Test the Twilio SMS delivery system for horoscope notifications
          </p>
        </div>

        {/* Test Configuration */}
        <Card className="bg-gray-900 border-purple-900/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Test Configuration
            </CardTitle>
            <CardDescription>
              Configure the phone number for SMS testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testPhone" className="text-gray-300">Test Phone Number</Label>
              <Input
                id="testPhone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+15551234567"
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use a valid phone number format with country code
              </p>
            </div>
            
            <Button
              onClick={runFullTest}
              disabled={createTestUserMutation.isPending || generateHoroscopesMutation.isPending || deliverHoroscopesMutation.isPending}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Run Complete SMS Test
            </Button>
          </CardContent>
        </Card>

        {/* Individual Test Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">1. Create Test User</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => createTestUserMutation.mutate()}
                disabled={createTestUserMutation.isPending}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Create User
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">2. Generate Horoscopes</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generateHoroscopesMutation.mutate()}
                disabled={generateHoroscopesMutation.isPending}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Generate
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">3. Send SMS</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => deliverHoroscopesMutation.mutate()}
                disabled={deliverHoroscopesMutation.isPending}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Deliver SMS
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {result.result === 'PASS' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-medium text-white">{result.test}</h4>
                        <p className="text-sm text-gray-400">{result.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.result === 'PASS' ? 'bg-green-900 text-green-300' :
                        result.result === 'FAIL' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {result.result}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{result.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SMS Testing Instructions */}
        <Card className="bg-gray-900 border-purple-900/30">
          <CardHeader>
            <CardTitle className="text-white">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <p>1. Ensure your Twilio credentials are properly configured in environment variables</p>
            <p>2. Use a verified phone number for testing (Twilio trial accounts have restrictions)</p>
            <p>3. The complete test will create a user, generate horoscopes, and attempt SMS delivery</p>
            <p>4. Check your phone for the SMS message after running the test</p>
            <p>5. Monitor the console logs for detailed delivery information</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}