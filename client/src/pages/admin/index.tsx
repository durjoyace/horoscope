import React from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Sparkles,
  Calendar,
  Mail,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // Sample admin menu cards
  const adminCards = [
    {
      title: "Analytics",
      description: "User engagement metrics and content performance",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/admin/analytics",
      color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
      iconColor: "text-purple-500",
    },
    {
      title: "User Management",
      description: "Manage users, permissions and subscriptions",
      icon: <Users className="h-6 w-6" />,
      path: "/admin/users",
      color: "from-blue-500/20 to-sky-500/20 border-blue-500/30",
      iconColor: "text-blue-500",
    },
    {
      title: "Content Management",
      description: "Create and edit horoscopes and content",
      icon: <FileText className="h-6 w-6" />,
      path: "/admin/content",
      color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
      iconColor: "text-amber-500",
    },
    {
      title: "Settings",
      description: "Configure system settings and preferences",
      icon: <Settings className="h-6 w-6" />,
      path: "/admin/settings",
      color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
      iconColor: "text-emerald-500",
    },
  ];

  // Quick Stats Sample Data
  const quickStats = [
    {
      title: "Total Users",
      value: "1,284",
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Premium Subscribers",
      value: "286",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Daily Horoscopes",
      value: "12",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      title: "Monthly Revenue",
      value: "$8,492",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome to the Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your application, monitor analytics, and configure settings
          </p>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-full`}>
                      <div className={stat.iconColor}>{stat.icon}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admin Cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminCards.map((card, index) => (
              <Card
                key={index}
                className={`shadow-md bg-gradient-to-br ${card.color} hover:shadow-lg transition-shadow`}
              >
                <CardHeader>
                  <div className={`${card.iconColor}`}>{card.icon}</div>
                  <CardTitle className="mt-2">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-background/50 hover:bg-background/80"
                    asChild
                  >
                    <Link href={card.path}>
                      <span className="flex items-center justify-center">
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                  <div className="bg-blue-500/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-muted-foreground">
                      John Smith created a new account
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                  <div className="bg-purple-500/10 p-2 rounded-full">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">New subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Emma Johnson purchased Premium plan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-full">
                    <Mail className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Daily horoscopes sent</p>
                    <p className="text-sm text-muted-foreground">
                      Daily horoscopes delivered to 1,245 users
                    </p>
                    <p className="text-xs text-muted-foreground">
                      6 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}