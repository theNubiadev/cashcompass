"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  Compass,
  X,
} from "lucide-react";.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
} | null;

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
      <div className="fixed top-0 left-0 z-40 md:hidden flex items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="/dashboard" className="ml-3 font-bold text-xl text-emerald-600">
          CashCompass
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 z-30 pt-20 md:pt-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                CashCompass
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart Finance
              </p>
            </div>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback className="bg-emerald-600 text-white font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="mt-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Info */}
          <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="p-4 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                💡 Pro Tip
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Set budget alerts to stay on track with your spending goals.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
