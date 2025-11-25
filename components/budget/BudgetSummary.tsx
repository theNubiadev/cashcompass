"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, LucideIcon } from "lucide-react";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly";
}

interface BudgetSummaryProps {
  budgets: Budget[];
}

interface Stat {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  subtitle?: string;
}

export function BudgetSummary({ budgets }: BudgetSummaryProps) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const overBudget = budgets.filter(b => (b.spent / b.limit) * 100 > 100).length;
  const nearLimit = budgets.filter(b => {
    const percent = (b.spent / b.limit) * 100;
    return percent > 80 && percent <= 100;
  }).length;
  const onTrack = budgets.filter(b => (b.spent / b.limit) * 100 <= 80).length;

  const stats: Stat[] = [
    {
      title: "Total Budget",
      value: `$${totalBudget.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-100 dark:bg-gray-800",
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      color: percentUsed > 100 ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400",
      bgColor: percentUsed > 100 ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30",
      subtitle: `${percentUsed.toFixed(1)}% of total`,
    },
    {
      title: "Remaining",
      value: `$${Math.abs(totalRemaining).toFixed(2)}`,
      icon: totalRemaining >= 0 ? CheckCircle : AlertCircle,
      color: totalRemaining >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      bgColor: totalRemaining >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30",
      subtitle: totalRemaining < 0 ? "Over budget" : "Available",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Budget Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {onTrack}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                On Track
              </p>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {nearLimit}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Near Limit
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {overBudget}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Over Budget
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}