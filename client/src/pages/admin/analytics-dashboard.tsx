import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown,
  Users, 
  UserCheck, 
  CreditCard, 
  Mail, 
  Award, 
  Zap, 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Tablet, 
  MapPin, 
  Clock, 
  User,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define types for analytics data
interface UserEngagementStats {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  signupsByZodiacSign: Record<string, number>;
  engagementRate: number;
  premiumConversion: number;
  growthRate: number;
  deliveryStats: {
    emailDeliveryRate: number;
    smsDeliveryRate: number;
    totalDeliveries: number;
  };
  userActivity: {
    newUsers: number[];
    returningUsers: number[];
    labels: string[];
  };
}

interface ContentPerformanceMetrics {
  topPerformingHoroscopes: Array<{
    date: string;
    sign: string;
    openRate: number;
    clickRate: number;
  }>;
  mostEngagedZodiacSigns: Array<{
    sign: string;
    engagementScore: number;
  }>;
  categoryEngagement: Record<string, number>;
  contentTrends: {
    dates: string[];
    engagementScores: number[];
  };
}

interface UserRetentionData {
  retentionRate: number;
  retentionByZodiacSign: Record<string, number>;
  churnRate: number;
  averageSessionDuration: number;
  retentionTrend: {
    dates: string[];
    rates: number[];
  };
  userFeedback: {
    category: string;
    score: number;
    count: number;
  }[];
}

interface DeviceAndLocationData {
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topLocations: {
    region: string;
    users: number;
  }[];
  activeHours: {
    hour: number;
    users: number;
  }[];
}

interface AnalyticsDashboardData {
  userEngagement: UserEngagementStats;
  contentPerformance: ContentPerformanceMetrics;
  userRetention: UserRetentionData;
  deviceAndLocation: DeviceAndLocationData;
  lastUpdated: string;
}

interface ApiResponse {
  success: boolean;
  data: AnalyticsDashboardData;
}

// Chart data interfaces
interface SignupChartData {
  name: string;
  value: number;
  color: string;
}

interface TopHoroscopeChartData {
  name: string;
  open: number;
  click: number;
  color: string;
}

interface CategoryChartData {
  name: string;
  value: number;
  color: string;
}

interface RetentionChartData {
  name: string;
  retention: number;
  color: string;
}

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
  const { data: analyticsData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["/api/admin/analytics"],
    retry: 1,
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
  const signupsByZodiacData: SignupChartData[] = Object.entries(data.userEngagement.signupsByZodiacSign).map(
    ([sign, count], index) => ({
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      value: count as number,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => (b.value as number) - (a.value as number));

  // Format the data for content performance chart
  const topHoroscopesData: TopHoroscopeChartData[] = data.contentPerformance.topPerformingHoroscopes.map(
    (item: any, index: number) => ({
      name: item.sign.charAt(0).toUpperCase() + item.sign.slice(1),
      open: item.openRate,
      click: item.clickRate,
      color: COLORS[index % COLORS.length],
    })
  );

  // Format the data for category engagement chart
  const categoryEngagementData: CategoryChartData[] = Object.entries(data.contentPerformance.categoryEngagement).map(
    ([category, value], index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: value as number,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => (b.value as number) - (a.value as number));
  
  // Format the data for retention by zodiac sign
  const retentionBySignData: RetentionChartData[] = Object.entries(data.userRetention.retentionByZodiacSign).map(
    ([sign, retention], index) => ({
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      retention: retention as number,
      color: COLORS[index % COLORS.length],
    })
  ).sort((a, b) => (b.retention as number) - (a.retention as number));

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor user engagement, content performance, and business metrics
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">User Insights</TabsTrigger>
          <TabsTrigger value="devices">Devices & Location</TabsTrigger>
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

          <div className="grid grid-cols-1 gap-4">
            {/* User Activity Chart */}
            <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-y-2">
                  <div>
                    <CardTitle>User Activity Growth</CardTitle>
                    <CardDescription>New vs. returning users and growth trends</CardDescription>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <div className="flex items-center gap-x-2">
                      <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                      <span className="text-xs text-muted-foreground">New Users</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-muted-foreground">Returning Users</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.userEngagement.userActivity.labels.map((label, index) => ({
                        name: label,
                        new: data.userEngagement.userActivity.newUsers[index],
                        returning: data.userEngagement.userActivity.returningUsers[index],
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          borderRadius: '0.375rem',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          color: '#ffffff',
                          fontSize: '0.75rem'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="returning" 
                        stackId="1"
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.6} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="new" 
                        stackId="1"
                        stroke="#6366F1" 
                        fill="#6366F1" 
                        fillOpacity={0.4} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Sign Distribution */}
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

              {/* Delivery Stats */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Content Category Engagement */}
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
            
            {/* Content Trends */}
            <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Content Engagement Trends</CardTitle>
                <CardDescription>
                  30-day engagement score trend
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.contentPerformance.contentTrends.dates.map((date, index) => ({
                        date,
                        score: data.contentPerformance.contentTrends.engagementScores[index]
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth()+1}`;
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          borderRadius: '0.375rem',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          color: '#ffffff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="Engagement Score"
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        dot={{ r: 2, fill: "#8B5CF6" }}
                        activeDot={{ r: 5, fill: "#8B5CF6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Retention by Zodiac Sign */}
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
            
            {/* Retention Trend */}
            <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Retention Trend (30 Days)</CardTitle>
                <CardDescription>
                  Daily retention rate over time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.userRetention.retentionTrend.dates.map((date, index) => ({
                        date,
                        rate: data.userRetention.retentionTrend.rates[index]
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth()+1}`;
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis domain={[50, 90]} />
                      <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        name="Retention Rate"
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ r: 2, fill: "#10B981" }}
                        activeDot={{ r: 5, fill: "#10B981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* User Feedback */}
          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Satisfaction Metrics</CardTitle>
                <CardDescription>
                  User feedback scores across key categories
                </CardDescription>
              </div>
              <Star className="h-6 w-6 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-5">
                  {data.userRetention.userFeedback.map((feedback, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{feedback.category}</span>
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-medium">{feedback.score.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({feedback.count} ratings)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <Progress
                          value={(feedback.score / 5) * 100}
                          className="h-2"
                          style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                          }}
                        />
                        <span className="text-xs w-12 text-right">{((feedback.score / 5) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      outerRadius="80%" 
                      data={data.userRetention.userFeedback.map(feedback => ({
                        subject: feedback.category,
                        score: feedback.score,
                        fullMark: 5
                      }))}
                    >
                      <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgba(255, 255, 255, 0.8)' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 5]} />
                      <Radar 
                        name="Satisfaction Score" 
                        dataKey="score" 
                        stroke="#EC4899" 
                        fill="#EC4899" 
                        fillOpacity={0.5} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Devices & Location Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Mobile Users"
              value={`${data.deviceAndLocation.deviceBreakdown.mobile}%`}
              icon={<Smartphone className="h-5 w-5 text-blue-500" />}
              helperText="Percentage of mobile visitors"
              className="bg-gradient-to-br from-blue-900/30 to-blue-700/20 border-blue-500/20"
            />
            <StatCard
              title="Desktop Users"
              value={`${data.deviceAndLocation.deviceBreakdown.desktop}%`}
              icon={<Laptop className="h-5 w-5 text-emerald-500" />}
              helperText="Percentage of desktop visitors"
              className="bg-gradient-to-br from-emerald-900/30 to-emerald-700/20 border-emerald-500/20"
            />
            <StatCard
              title="Tablet Users"
              value={`${data.deviceAndLocation.deviceBreakdown.tablet}%`}
              icon={<Tablet className="h-5 w-5 text-amber-500" />}
              helperText="Percentage of tablet visitors"
              className="bg-gradient-to-br from-amber-900/30 to-amber-700/20 border-amber-500/20"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>User Location Distribution</CardTitle>
                <CardDescription>
                  Top user locations by region
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.deviceAndLocation.topLocations}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="region" type="category" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar
                        dataKey="users"
                        name="Users"
                        fill="#8B5CF6"
                        radius={[0, 4, 4, 0]}
                      >
                        {data.deviceAndLocation.topLocations.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
              <CardHeader>
                <CardTitle>Active Hours</CardTitle>
                <CardDescription>
                  Hourly user activity distribution (UTC)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pb-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.deviceAndLocation.activeHours}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="hour" 
                        tickFormatter={(hour) => `${hour}:00`}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatNumber(value as number)}
                        labelFormatter={(hour) => `${hour}:00 - ${(Number(hour) + 1) % 24}:00 UTC`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        name="Active Users"
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.6} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Device & Location Insights</CardTitle>
                <CardDescription>
                  Detailed user access data for targeted content delivery
                </CardDescription>
              </div>
              <MapPin className="h-6 w-6 text-purple-500" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Primary Device</TableHead>
                    <TableHead>Peak Hour (UTC)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.deviceAndLocation.topLocations.slice(0, 5).map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{location.region}</TableCell>
                      <TableCell>{location.users}%</TableCell>
                      <TableCell>
                        {index % 3 === 0 ? (
                          <div className="flex items-center gap-x-2">
                            <Smartphone className="h-4 w-4 text-blue-500" />
                            <span>Mobile</span>
                          </div>
                        ) : index % 3 === 1 ? (
                          <div className="flex items-center gap-x-2">
                            <Laptop className="h-4 w-4 text-emerald-500" />
                            <span>Desktop</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-x-2">
                            <Tablet className="h-4 w-4 text-amber-500" />
                            <span>Tablet</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{(9 + index * 2) % 24}:00</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        {/* User Activity Chart */}
        <Skeleton className="h-80" />

        {/* Distribution & Delivery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-end">
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    </div>
  );
}