import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Phone, Mail, MessageSquare, Users, Filter, Send } from "lucide-react";

interface CRMUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  zodiacSign: string;
  smsOptIn: boolean;
  emailOptIn: boolean;
  createdAt: string;
  subscriptionStatus: string;
}

export default function CRMDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'sms' | 'email'>('all');
  const { toast } = useToast();

  // Fetch all users for CRM
  const { data: users = [], isLoading } = useQuery<CRMUser[]>({
    queryKey: ['/api/admin/crm/users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/crm/users');
      return response.json();
    }
  });

  // Test SMS functionality
  const testSMSMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest('POST', `/api/admin/test-sms/${userId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SMS Test Result",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: () => {
      toast({
        title: "SMS Test Failed",
        description: "Failed to send test SMS",
        variant: "destructive",
      });
    }
  });

  // Broadcast SMS to all opted-in users
  const broadcastSMSMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/admin/broadcast-sms', { message });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Broadcast Complete",
        description: `SMS sent to ${data.sentCount} users`,
      });
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.zodiacSign.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'sms' && user.smsOptIn) ||
      (filterType === 'email' && user.emailOptIn);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalUsers: users.length,
    smsOptIns: users.filter(u => u.smsOptIn).length,
    emailOptIns: users.filter(u => u.emailOptIn).length,
    premiumUsers: users.filter(u => u.subscriptionStatus !== 'none').length
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              CRM Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage customer contacts and communication preferences
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">SMS Subscribers</CardTitle>
              <Phone className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.smsOptIns}</div>
              <p className="text-xs text-gray-400">
                {((stats.smsOptIns / stats.totalUsers) * 100).toFixed(1)}% opt-in rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Email Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.emailOptIns}</div>
              <p className="text-xs text-gray-400">
                {((stats.emailOptIns / stats.totalUsers) * 100).toFixed(1)}% opt-in rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Premium Users</CardTitle>
              <MessageSquare className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.premiumUsers}</div>
              <p className="text-xs text-gray-400">
                {((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-900 border-purple-900/30">
          <CardHeader>
            <CardTitle className="text-white">Customer Database</CardTitle>
            <CardDescription>
              Search and filter customer contacts for CRM management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, phone, or zodiac sign..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All Users
                </Button>
                <Button
                  variant={filterType === 'sms' ? 'default' : 'outline'}
                  onClick={() => setFilterType('sms')}
                  size="sm"
                >
                  SMS Subscribers
                </Button>
                <Button
                  variant={filterType === 'email' ? 'default' : 'outline'}
                  onClick={() => setFilterType('email')}
                  size="sm"
                >
                  Email Subscribers
                </Button>
              </div>
            </div>

            {/* User List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading contacts...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No contacts found matching your criteria</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {user.zodiacSign}
                      </Badge>
                      {user.smsOptIn && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          SMS
                        </Badge>
                      )}
                      {user.emailOptIn && (
                        <Badge variant="default" className="text-xs bg-blue-600">
                          Email
                        </Badge>
                      )}
                      {user.subscriptionStatus !== 'none' && (
                        <Badge variant="default" className="text-xs bg-amber-600">
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="ml-4">
                      {user.smsOptIn && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testSMSMutation.mutate(user.id)}
                          disabled={testSMSMutation.isPending}
                          className="text-xs"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Test SMS
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}