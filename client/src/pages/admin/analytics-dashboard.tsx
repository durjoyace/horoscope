import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { ArrowUp, ArrowDown, Users, UserCheck, CreditCard, Mail, Award, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// Define colors for our charts
const COLORS = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#F97316", // Orange
  "#14B8A6", // Teal
  "#8B5CF6", // Purple (repeat for more items)
  "#EC4899",
  "#3B82F6",
];

// Format large numbers with commas
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function AnalyticsDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics data
  const { data: analyticsData, isLoading, error } = useQuery<{success: boolean, data: any}>({
    queryKey: ["/api/admin/analytics"],
    retry: 1,
    onError: (err) => {
      toast({
        title: "Error loading analytics",
        description: err instanceof Error ? err.message : "Failed to load analytics data",
        variant: "destructive",
      });
    },
  });

  // Handle loading state
  if (isLoading) {
    return <AnalyticsDashboardSkeleton />;
  }

  // Handle error state
  if (error || !analyticsData?.data) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Failed to load analytics data</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again later or contact support."}
          </p>
        </div>
      </div>
    );
  }

  const data = analyticsData.data;
  
  // Format the data for zodiac sign distribution chart
  const signupsByZodiacData = Object.entries(data.userEngagement.signupsByZodiacSign).map(
    ([sign, count], index) => ({
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      value: count,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => b.value - a.value);

  // Format the data for content performance chart
  const topHoroscopesData = data.contentPerformance.topPerformingHoroscopes.map(
    (item, index) => ({
      name: item.sign.charAt(0).toUpperCase() + item.sign.slice(1),
      open: item.openRate,
      click: item.clickRate,
      color: COLORS[index % COLORS.length],
    })
  );

  // Format the data for category engagement chart
  const categoryEngagementData = Object.entries(data.contentPerformance.categoryEngagement).map(
    ([category, value], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: value,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => b.value - a.value);
  
  // Format the data for retention by zodiac sign
  const retentionBySignData = Object.entries(data.userRetention.retentionByZodiacSign).map(
    ([sign, retention], index) => ({
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      retention: retention,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => b.retention - a.retention);

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor user engagement, content performance, and business metrics
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={formatNumber(data.userEngagement.totalUsers)}
              icon={<Users className="h-5 w-5 text-indigo-500" />}
              helperText="Total registered users"
              className="bg-gradient-to-br from-indigo-900/30 to-indigo-700/20 border-indigo-500/20"
            />
            <StatCard
              title="Daily Active Users"
              value={formatNumber(data.userEngagement.activeUsers.daily)}
              icon={<UserCheck className="h-5 w-5 text-teal-500" />}
              helperText={`${Math.round((data.userEngagement.activeUsers.daily / data.userEngagement.totalUsers) * 100)}% of total users`}
              className="bg-gradient-to-br from-teal-900/30 to-teal-700/20 border-teal-500/20"
            />
            <StatCard
              title="Premium Conversion"
              value={`${data.userEngagement.premiumConversion}%`}
              icon={<CreditCard className="h-5 w-5 text-amber-500" />}
              helperText={`${formatNumber(Math.round(data.userEngagement.totalUsers * (data.userEngagement.premiumConversion / 100)))} premium users`}
              className="bg-gradient-to-br from-amber-900/30 to-amber-700/20 border-amber-500/20"
            />
            <StatCard
              title="Engagement Rate"
              value={`${data.userEngagement.engagementRate}%`}
              icon={<Zap className="h-5 w-5 text-purple-500" />}
              helperText="Avg. content interaction rate"
              className="bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Sign Distribution</CardTitle>
                <CardDescription>User distribution by zodiac sign</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={signupsByZodiacData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {signupsByZodiacData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Delivery Stats</CardTitle>
                <CardDescription>Email and SMS delivery performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Email Delivery Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {data.userEngagement.deliveryStats.emailDeliveryRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.userEngagement.deliveryStats.emailDeliveryRate}
                    className="h-2 bg-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">SMS Delivery Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {data.userEngagement.deliveryStats.smsDeliveryRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.userEngagement.deliveryStats.smsDeliveryRate}
                    className="h-2 bg-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Deliveries</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {formatNumber(data.userEngagement.deliveryStats.totalDeliveries)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Top Performing Horoscopes</CardTitle>
                <CardDescription>
                  Horoscopes with highest engagement by zodiac sign
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topHoroscopesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Bar dataKey="open" name="Open Rate" fill="#8884d8" />
                      <Bar dataKey="click" name="Click Rate" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Most Engaged Signs</CardTitle>
                <CardDescription>
                  Zodiac signs with highest engagement rates
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.contentPerformance.mostEngagedZodiacSigns}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="sign" type="category" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar
                        dataKey="engagementScore"
                        name="Engagement Score"
                        fill="#8B5CF6"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
            <CardHeader>
              <CardTitle>Content Category Engagement</CardTitle>
              <CardDescription>
                Percentage of user engagement by content category
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pb-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryEngagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Retention Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Retention Rate"
              value={`${data.userRetention.retentionRate}%`}
              icon={<ArrowUp className="h-5 w-5 text-green-500" />}
              helperText="Overall user retention rate"
              className="bg-gradient-to-br from-green-900/30 to-green-700/20 border-green-500/20"
            />
            <StatCard
              title="Churn Rate"
              value={`${data.userRetention.churnRate}%`}
              icon={<ArrowDown className="h-5 w-5 text-red-500" />}
              helperText="User subscription cancellation rate"
              className="bg-gradient-to-br from-red-900/30 to-red-700/20 border-red-500/20"
            />
            <StatCard
              title="Avg. Session Duration"
              value={`${data.userRetention.averageSessionDuration} min`}
              icon={<Award className="h-5 w-5 text-amber-500" />}
              helperText="Average time spent per session"
              className="bg-gradient-to-br from-amber-900/30 to-amber-700/20 border-amber-500/20"
            />
          </div>

          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
            <CardHeader>
              <CardTitle>Retention by Zodiac Sign</CardTitle>
              <CardDescription>
                User retention rate broken down by zodiac sign
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pb-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={retentionBySignData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar
                      dataKey="retention"
                      name="Retention Rate"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    >
                      {retentionBySignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(data.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Stat card component for KPIs
function StatCard({
  title,
  value,
  icon,
  helperText,
  className,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  helperText: string;
  className?: string;
}) {
  return (
    <Card className={`shadow-md ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">{title}</span>
          <div className="p-2 rounded-full bg-primary/10">{icon}</div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{helperText}</p>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for the analytics dashboard
function AnalyticsDashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  );
}