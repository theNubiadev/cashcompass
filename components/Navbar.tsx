"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, Target, BarChart3, Compass } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Compass className="h-6 w-6" />
            <span>CashCompass</span>
          </Link>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                //   className={(
                //     'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                //     isActive
                //       ? 'bg-primary text-primary-foreground'
                //       : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      //   )}
                      className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
