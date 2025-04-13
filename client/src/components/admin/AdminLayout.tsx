import React from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Home,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({
  children,
  title = "Admin Dashboard",
}: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Content",
      path: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-purple-900 to-indigo-900 shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <Link href="/">
                <span className="text-white text-xl font-bold">
                  HoroscopeHealth
                </span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                      location === item.path
                        ? "bg-purple-700 text-white"
                        : "text-white hover:bg-purple-800/50"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-purple-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.firstName || user?.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-purple-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-50"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-gradient-to-br from-purple-900 to-indigo-900">
            <div className="flex flex-col h-full">
              <div className="px-4 py-6 border-b border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-white text-xl font-bold">
                      HoroscopeHealth
                    </span>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-white">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
              </div>
              <nav className="flex-1 px-2 py-4 overflow-y-auto">
                {navItems.map((item) => (
                  <SheetClose key={item.path} asChild>
                    <Link href={item.path}>
                      <a
                        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                          location === item.path
                            ? "bg-purple-700 text-white"
                            : "text-white hover:bg-purple-800/50"
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </a>
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="px-4 py-4 border-t border-purple-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName || user?.email}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-purple-300 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center mb-4">
                <Link href="/">
                  <span className="text-sm text-muted-foreground hover:text-foreground">
                    Home
                  </span>
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                <Link href="/admin">
                  <span className="text-sm text-muted-foreground hover:text-foreground">
                    Admin
                  </span>
                </Link>
                {location !== "/admin" && (
                  <>
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    <span className="text-sm font-medium">{title}</span>
                  </>
                )}
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}