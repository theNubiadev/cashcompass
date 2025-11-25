// app/analytics/page.tsx
"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpendingTrendsChart } from "@/components/analytics/SpendingTrendsChart";
// import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { MonthlyComparisonChart } from "@/components/analytics/MonthlyComparisonChart";
import { AnalyticsStatsCards } from "@/components/analytics/AnalysisStatCard";
import { Toaster } from "sonner";

// Mock data - replace with actual API calls
const spendingTrendsData = [
  { date: "Nov 1", amount: 45.5 },
  { date: "Nov 3", amount: 125.0 },
  { date: "Nov 5", amount: 85.3 },
  { date: "Nov 7", amount: 200.5 },
  { date: "Nov 9", amount: 75.8 },
  { date: "Nov 11", amount: 150.2 },
  { date: "Nov 13", amount: 95.0 },
  { date: "Nov 15", amount: 180.5 },
  { date: "Nov 17", amount: 120.0 },
  { date: "Nov 19", amount: 220.3 },
  { date: "Nov 21", amount: 105.5 },
  { date: "Nov 23", amount: 165.0 },
  { date: "Nov 25", amount: 140.8 },
];

const categoryBreakdownData = [
  { name: "Food & Dining", value: 450.50 },
  { name: "Transportation", value: 185.00 },
  { name: "Entertainment", value: 125.99 },
  { name: "Shopping", value: 325.50 },
  { name: "Bills & Utilities", value: 289.50 },
  { name: "Healthcare", amount: 75.00 },
];

const monthlyComparisonData = [
  { month: "Aug", expenses: 1200, budget: 1500 },
  { month: "Sep", expenses: 1450, budget: 1500 },
  { month: "Oct", expenses: 1350, budget: 1500 },
  { month: "Nov", expenses: 1650, budget: 1500 },
];

const statsData = {
  totalSpent: 2450.75,
  averageDaily: 81.69,
  averageTransaction: 91.51,
  highestCategory: { name: "Food & Dining", amount: 450.50 },
  transactionCount: 26,
  budgetUtilization: 85.5,
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("30days");

  const handleExport = () => {
    console.log("Exporting analytics data...");
    // TODO: Implement export functionality
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-right" richColors closeButton />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Insights into your spending habits and patterns
                </p>
              </div>

              <div className="flex gap-2">
                <Select
                  value={timeRange}
                  onValueChange={(value: "7days" | "30days" | "90days") => setTimeRange(value)}
                >
                  <SelectTrigger className="w-[140px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <AnalyticsStatsCards stats={statsData} />

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Spending Trends - Full Width on Mobile, Half on Desktop */}
            <div className="lg:col-span-2">
              <SpendingTrendsChart data={spendingTrendsData} />
            </div>

            {/* Category Breakdown */}
            {/* <CategoryBreakdownChart data={categoryBreakdownData} /> */}

            {/* Monthly Comparison */}
            <MonthlyComparisonChart data={monthlyComparisonData} />
          </div>

          {/* Additional Insights Section */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                💡 Spending Insight
              </h3>
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Your spending increased by 10% this month compared to last month. Consider reviewing your Food & Dining budget.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Top Saving Tip
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You spent $325.50 on Shopping this month. Setting a $250 budget could save you $75.50 monthly.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                🎯 Budget Status
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                You&apos;re using 85.5% of your total budget. You have $217.25 remaining for this month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}