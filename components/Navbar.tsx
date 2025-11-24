"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Target, BarChart3, Compass, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();
  
  // TODO: Replace with actual authentication check
  // Example: const isAuthenticated = !!session?.user;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    console.log('Logging out...');
    setIsAuthenticated(false);
  };

  return (
    <nav className="border-b border-emerald-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <Compass className="h-7 w-7 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CashCompass
            </span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Dashboard Navigation - Only show when logged in */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="ml-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Auth Buttons - Only show when not logged in */}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Link href="/auth/signin">
                    <LogIn className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
                
                <Button
                  asChild
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}