"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Receipt,
  Target,
  ChevronRight,
  LogOut,
  Menu,
  Compass,
  X,
  BarChart4,
  Info,
  Settings,Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
} | null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/budgets", label: "Budgets", icon: Target },
    { href: "/analytics", label: "Analytics", icon: BarChart4 }
];
  
    const bottomNav = [
    { href: "/help", label: "Help and Support", icon: Info },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (res.ok) {
        toast.success("Logged out successfully");
        setUser(null);
        router.push("/auth/signin");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };
  // Don't show sidebar on auth pages
  if (!user || pathname?.startsWith("/auth") || pathname === "/onboarding") {
    return null;
  }
  const userInitials = user
    ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase()
    : "U";

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 z-40 md:hidden flex items-center p-6 bg-gray-50">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-50 transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-4 mb-4">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-bold text-lg text-emerald-600">Cashcompass</h1>
          </div>

          {/* Main Navigation - Inset Style */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all group ${
                    isActive
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-700 "
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-500"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 text-emerald-600" />}
                </Link>
              );
            })}
          </nav>
          {/* Secondary Navigation Section */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            {/* Others Label */}
            <div className="px-3 py-2">
              <p className="text-gray-500 text-xs font-semibold tracking-wider">Others</p>
            </div>

            {/* Secondary Navigation */}
            <nav className="space-y-1 mb-4">
              {bottomNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all group ${
                      isActive
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-700 hover:bg-white/60"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-500"}`} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 text-emerald-600" />}
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
              <button className="w-full flex items-center gap-3 group">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=Adrian`} alt="" />
                      <AvatarFallback className="bg-emerald-600 text-white font-semibold  text-sm ">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                     <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.firstName}{ user.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{ user.email}</p>
                </div>
                    
                    <LogOut onClick={() => handleLogout()}
                      className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </button>
            </div>
              )}
            </div>
        </div>
      </aside>      
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
