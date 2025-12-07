// app/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpendingTrendsChart } from "@/components/analytics/SpendingTrendsChart";
import { MonthlyComparisonChart } from "@/components/analytics/MonthlyComparisonChart";
import { Toaster, toast } from "sonner";

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

type Budget = {
  userId: string;
  amount: number;
  period: "weekly" | "monthly";
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">(
    "30days"
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [expensesRes, budgetRes] = await Promise.all([
        fetch("/api/expenses", { credentials: "same-origin" }),
        fetch("/api/budget", { credentials: "same-origin" }),
      ]);

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data.expenses || []);
      }

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudget(data.budget);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter expenses by time range
  const getFilteredExpenses = () => {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
    }

    return expenses.filter((expense) => new Date(expense.date) >= startDate);
  };

  // Calculate spending trends data
  const getSpendingTrendsData = () => {
    const filtered = getFilteredExpenses();
    const dateMap = new Map<string, number>();

    filtered.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dateMap.set(date, (dateMap.get(date) || 0) + expense.amount);
    });

    return Array.from(dateMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  // Calculate monthly comparison
  const getMonthlyComparisonData = () => {
    const now = new Date();
    const months = [];

    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthExpenses = expenses.filter((e) => {
        const expenseDate = new Date(e.date);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      });

      const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      months.push({
        month: monthName,
        expenses: parseFloat(totalExpenses.toFixed(2)),
        budget: budget?.amount || 1500,
      });
    }

    return months;
  };

  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    const filtered = getFilteredExpenses();
    const categoryMap = new Map<string, number>();

    filtered.forEach((expense) => {
      categoryMap.set(
        expense.category,
        (categoryMap.get(expense.category) || 0) + expense.amount
      );
    });

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      name: category,
      value: parseFloat(amount.toFixed(2)),
    }));
  };

  // Calculate stats
  const calculateStats = () => {
    const filtered = getFilteredExpenses();
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    const average = filtered.length > 0 ? total / filtered.length : 0;
    const dailyAverage =
      filtered.length > 0 ? total / (parseInt(timeRange) || 30) : 0;

    const categoryBreakdown = getCategoryBreakdown();
    const highestCategory =
      categoryBreakdown.length > 0
        ? categoryBreakdown.reduce((prev, current) =>
            prev.value > current.value ? prev : current
          )
        : null;

    return {
      totalSpent: parseFloat(total.toFixed(2)),
      averageDaily: parseFloat(dailyAverage.toFixed(2)),
      averageTransaction: parseFloat(average.toFixed(2)),
      highestCategory: highestCategory || { name: "N/A", value: 0 },
      transactionCount: filtered.length,
      budgetUtilization: budget
        ? parseFloat(((total / budget.amount) * 100).toFixed(1))
        : 0,
    };
  };

  const handleExport = () => {
    const filtered = getFilteredExpenses();
    const stats = calculateStats();

    const data = {
      exportDate: new Date().toISOString(),
      timeRange,
      stats,
      expenses: filtered.map((e) => ({
        description: e.description,
        category: e.category,
        amount: e.amount,
        date: e.date,
      })),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics-${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Analytics exported successfully");
  };

  const stats = calculateStats();
  const spendingTrendsData = getSpendingTrendsData();
  const monthlyComparisonData = getMonthlyComparisonData();
  const categoryBreakdownData = getCategoryBreakdown();

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-64">
        <div className="container mx-auto p-4 md:p-6 space-y-6 pt-24 md:pt-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Insights into your spending habits and patterns
                </p>
              </div>

              <div className="flex gap-2">
                <Select
                  value={timeRange}
                  onValueChange={(value: "7days" | "30days" | "90days") =>
                    setTimeRange(value)
                  }
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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Spent
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${stats.totalSpent.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Daily Avg
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${stats.averageDaily.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Transaction
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${stats.averageTransaction.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Transactions
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.transactionCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Top Category
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stats.highestCategory.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${stats.highestCategory.value.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Budget Used
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.budgetUtilization}%
                      </p>
                      <p className="text-xs text-gray-500">of total budget</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Spending Trends - Full Width on Mobile, Half on Desktop */}
                <div className="lg:col-span-2">
                  <SpendingTrendsChart data={spendingTrendsData} />
                </div>

                {/* Monthly Comparison */}
                <MonthlyComparisonChart data={monthlyComparisonData} />

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Distribution of expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryBreakdownData.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          No data available
                        </p>
                      ) : (
                        categoryBreakdownData.map((category) => (
                          <div key={category.name}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {category.name}
                              </span>
                              <span className="font-bold text-gray-900 dark:text-white">
                                ${category.value.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (category.value / stats.totalSpent) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Section */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                      💡 Spending Insight
                    </h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                      {stats.highestCategory.name} is your highest spending
                      category at ${stats.highestCategory.value.toFixed(2)}.
                      Consider setting stricter budgets if needed.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      📊 Average Spending
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your average transaction is $
                      {stats.averageTransaction.toFixed(2)}. You spend about $
                      {stats.averageDaily.toFixed(2)} per day on average.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      🎯 Budget Status
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      You&apos;re using {stats.budgetUtilization}% of your{" "}
                      {budget?.period} budget with $
                      {(budget ? budget.amount - stats.totalSpent : 0).toFixed(
                        2
                      )}{" "}
                      remaining.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
