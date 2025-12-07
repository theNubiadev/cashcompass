// app/budget/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { DollarSign, AlertCircle, TrendingUp, Wallet, PieChart, ArrowRight } from "lucide-react";
import { toast, Toaster } from "sonner";

type Budget = {
  userId: string;
  amount: number;
  period: "weekly" | "monthly";
};

type Expense = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

type BudgetStatus = {
  spent: number;
  remaining: number;
  percentage: number;
  warning: boolean;
};

const CATEGORIES = ["Groceries", "Rent", "Entertainment", "Utilities", "Transportation", "Healthcare", "Other"];

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [budgetRes, expensesRes] = await Promise.all([
        fetch("/api/budget", { credentials: "same-origin" }),
        fetch("/api/expenses", { credentials: "same-origin" }),
      ]);

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        if (data.budget) {
          setBudget(data.budget);
          setAmount(data.budget.amount.toString());
          setPeriod(data.budget.period);
        }
      }

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data.expenses || []);
        setBudgetStatus(data.budgetStatus);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load budget data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), period }),
        credentials: "same-origin",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Budget updated successfully!");
        setBudget(data.budget);
        await fetchAllData();
      } else {
        toast.error(data?.error || "Failed to update budget");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to update budget");
    } finally {
      setIsSaving(false);
    }
  };

  const categorySpending = CATEGORIES.map((cat) => ({
    category: cat,
    amount: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.amount > 0);

  const topExpenseCategories = categorySpending.sort((a, b) => b.amount - a.amount).slice(0, 5);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-64">
        <div className="container mx-auto p-4 md:p-6 space-y-6 pt-24 md:pt-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-white mb-2">
              Budget Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Set, track, and manage your budget with comprehensive insights
            </p>
          </div>

          {isLoading ? (
            <p className="text-center py-8">Loading budget data...</p>
          ) : (
            <>
              {/* Budget Status Overview */}
              {budget && budgetStatus && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Total Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">${budget.amount.toFixed(2)}</div>
                      <p className="text-xs text-gray-500 mt-1">{period === "weekly" ? "Per Week" : "Per Month"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Total Spent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">${budgetStatus.spent.toFixed(2)}</div>
                      <p className="text-xs text-gray-500 mt-1">{budgetStatus.percentage.toFixed(0)}% used</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Remaining
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${budgetStatus.remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                        ${budgetStatus.remaining.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Available</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={Math.min(budgetStatus.percentage, 100)} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">{budgetStatus.percentage.toFixed(0)}% of budget</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Warning Alert */}
              {budgetStatus?.warning && (
                <Card className="border-orange-300 bg-orange-50 dark:bg-orange-900/20">
                  <CardContent className="pt-6 flex gap-4">
                    <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-900 dark:text-orange-200">Budget Alert</h3>
                      <p className="text-sm text-orange-800 dark:text-orange-300 mt-1">
                        You&apos;ve spent {budgetStatus.percentage.toFixed(0)}% of your {period} budget. Consider reducing spending to stay within limits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Settings */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Budget</CardTitle>
                      <CardDescription>
                        {budget ? "Adjust your budget amount and period" : "Set up your budget"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveBudget} className="space-y-6">
                        {/* Budget Amount */}
                        <div className="space-y-2">
                          <Label htmlFor="amount" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            Budget Amount
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="pl-7 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Period Selection */}
                        <div className="space-y-3">
                          <Label className="text-gray-700 dark:text-gray-300">Budget Period</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {(["weekly", "monthly"] as const).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPeriod(p)}
                                className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
                                  period === p
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-emerald-500"
                                }`}
                              >
                                {p === "weekly" ? "Weekly" : "Monthly"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSaving}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          {isSaving ? "Saving..." : "Update Budget"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Spending Categories */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Categories</CardTitle>
                      <CardDescription>Your highest spending areas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topExpenseCategories.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">No expenses yet</p>
                      ) : (
                        <div className="space-y-4">
                          {topExpenseCategories.map((item) => (
                            <div key={item.category}>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                                <span className="text-emerald-600 font-bold">${item.amount.toFixed(2)}</span>
                              </div>
                              <Progress value={(item.amount / budgetStatus!.spent) * 100} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Budget Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* All Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Complete breakdown of all categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {categorySpending.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">No expenses yet. Start adding expenses to see the breakdown.</p>
                    ) : (
                      <div className="space-y-3">
                        {categorySpending.map((item) => (
                          <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Budget Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>Set a realistic budget based on your income and expenses</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>Track expenses regularly to identify spending patterns</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>We alert you when you reach 80% of your budget</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>Review and adjust monthly to stay on track</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>Use categories to organize and limit spending</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a href="/dashboard" className="flex-1">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Go to Dashboard
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}