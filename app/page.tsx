import {
  Wallet,
  DollarSign,
  Target,
  BarChart,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
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
    <>
      <div className="min-h-screen  font-poppins">
        {/* Hero section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center mb-6 gap-2">
              <Wallet className="w-10 h-10 text-black" />
              <h1 className="text-5xl md:text-6xl font-bold">CashCompass</h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Your personal finance companion for smarter spending decisions
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Track expenses, set budgets, and gain insights into your spending
              patterns with our intuitive expense management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 pb-16">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6  text-black" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Expense Tracking
                </CardTitle>
              </div>
              <CardDescription>
                Easily log and categorize your daily expenses to keep track of
                where your money goes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Budget Management
                </CardTitle>
              </div>
              <CardDescription>
                Set monthly budgets for different categories and monitor your
                spending against them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Spending Insights
                </CardTitle>
              </div>
              <CardDescription>
                Get detailed reports and visualizations to understand your
                spending habits better.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-black transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Multi-Device Sync
                </CardTitle>
              </div>
              <CardDescription>
                Access your financial data across all your devices with seamless
                synchronization.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Real-time Dashboard
                </CardTitle>
              </div>
              <CardDescription>
                Get an overview of your financial health at a glance with our
                comprehensive dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="-mt-4 font-bold">Quick & Easy</CardTitle>
              </div>
              <CardDescription>
                Add expenses in seconds with smart categorization and date
                selection. No complicated setup required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="-mt-4 font-bold">
                  Secure & Private
                </CardTitle>
              </div>
              <CardDescription>
                Your financial data is stored locally on your device. Complete
                privacy and control over your information.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 pb-16">
          <Card className="rounded">
            <Image src="https://www.shutterstock.com/image-photo/beautiful-asian-businesswoman-insert-coins-pin-2475189411?trackingId=b2a988f9-2736-4c2d-aa3b-7a4d307639ea" alt="" className="" />
          </Card>
          <Card className="rounded">
            <Image src="https://www.shutterstock.com/image-photo/pile-coins-beside-piggy-bank-calculator-2341795621?trackingId=b2a988f9-2736-4c2d-aa3b-7a4d307639ea" alt="" className="" />
          </Card>
          <Card className="rounded">
            <Image src="https://www.shutterstock.com/image-photo/serious-young-man-sit-workplace-desk-2609818593?trackingId=360688ef-f3c4-4a5b-ab71-50010b3ac8f4" alt="" className="" />
          </Card>
          {/* https://www.shutterstock.com/image-photo/side-view-confident-woman-calculates-utility-2457065669?trackingId=360688ef-f3c4-4a5b-ab71-50010b3ac8f4 */}
          {/* https://www.shutterstock.com/image-photo/woman-writing-list-debt-on-notebook-2021907254?trackingId=360688ef-f3c4-4a5b-ab71-50010b3ac8f4 */}
          {/* https://www.shutterstock.com/image-photo/minded-man-viewing-receipts-supermarket-tracking-1980000383?trackingId=360688ef-f3c4-4a5b-ab71-50010b3ac8f4 */}
        </div>
        {/* carousel avatar badge dropdown-menu table tabs spinner popover accordion */}
        {/* CTA  */}
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold mb-4">
                Ready to take control of your finances?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Start tracking your expenses and managing your budgets today.
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-semibold">CashCompass</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your personal expense tracking and budget management solution
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
