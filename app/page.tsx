import {
  DollarSign,
  Target,
  BarChart,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
  Compass,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen font-poppins">
      {/* Hero section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center mb-6 gap-3">
            <Compass className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              CashCompass
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
            Navigate Your Financial Journey with Confidence
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Track expenses, set budgets, and gain insights into your spending
            patterns with our intuitive expense management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features to Manage Your Money
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Expense Tracking
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Easily log and categorize your daily expenses to keep track of
                    where your money goes.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Budget Management
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Set monthly budgets for different categories and monitor your
                    spending against them.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <BarChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Spending Insights
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Get detailed reports and visualizations to understand your
                    spending habits better.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Real-time Dashboard
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Get an overview of your financial health at a glance with our
                    comprehensive dashboard.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Quick & Easy
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Add expenses in seconds with smart categorization and date
                    selection. No complicated setup required.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="font-bold text-gray-900 dark:text-white mb-2">
                    Secure & Private
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Your financial data is encrypted and secure. Complete
                    privacy and control over your information.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Visual Section */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          See CashCompass in Action
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <Image 
                src="https://www.shutterstock.com/image-photo/minded-man-viewing-receipts-supermarket-tracking-1980000383?trackingId=360688ef-f3c4-4a5b-ab71-50010b3ac8f4" 
                alt="Financial planning" 
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-2">Smart Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor every transaction effortlessly
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <Image 
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop" 
                alt="Budget planning" 
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-2">Budget Goals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set and achieve your financial targets
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <Image 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" 
                alt="Analytics dashboard" 
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-2">Clear Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize your spending patterns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-16">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-12 px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Take Control of Your Finances?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
                Join thousands of users who are already managing their budgets smarter with CashCompass.
              </p>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-lg">CashCompass</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} CashCompass. Your personal expense tracking and budget management solution.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}