import { AlertTriangle, Compass, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      {/* Logo/Brand Section */}
      <div className="flex items-center gap-2 mb-8">
        <Compass className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          CashCompass
        </h2>
      </div>

      {/* 404 Visual */}
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-30">
          <div className="w-64 h-64 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="relative">
          <AlertTriangle className="w-32 h-32 text-amber-500 dark:text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Error Code */}
      <h1 className="text-8xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
        404
      </h1>

      {/* Error Message */}
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Page Not Found
      </h3>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        Oops! Looks like you&apos;ve wandered off the financial path. 
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          asChild 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
        
        <Button 
          asChild 
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Helpful Links */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Need help? Try these popular pages:
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link 
            href="/expenses" 
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Expenses
          </Link>
          <Link 
            href="/budgets" 
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Budgets
          </Link>
          <Link 
            href="/analytics" 
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}