// components/analytics/AnalyticsStatsCards.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Target } from "lucide-react";

interface StatsData {
  totalSpent: number;
  averageDaily: number;
  averageTransaction: number;
  highestCategory: { name: string; amount: number };
  transactionCount: number;
  budgetUtilization: number;
}

interface AnalyticsStatsCardsProps {
  stats: StatsData;
}

export function AnalyticsStatsCards({ stats }: AnalyticsStatsCardsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  const statsCards = [
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      description: "This month",
    },
    {
      title: "Daily Average",
      value: `$${stats.averageDaily.toFixed(2)}`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "Per day spending",
    },
    {
      title: "Avg Transaction",
      value: `$${stats.averageTransaction.toFixed(2)}`,
      icon: CreditCard,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: `${stats.transactionCount} transactions`,
    },
    {
      title: "Top Category",
      value: stats.highestCategory.name,
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      description: `$${stats.highestCategory.amount.toFixed(2)}`,
    },
    {
      title: "Budget Usage",
      value: `${stats.budgetUtilization.toFixed(1)}%`,
      icon: stats.budgetUtilization > 80 ? TrendingDown : Target,
      color: stats.budgetUtilization > 100 
        ? "text-red-600 dark:text-red-400" 
        : stats.budgetUtilization > 80 
          ? "text-amber-600 dark:text-amber-400"
          : "text-emerald-600 dark:text-emerald-400",
      bgColor: stats.budgetUtilization > 100 
        ? "bg-red-100 dark:bg-red-900/30" 
        : stats.budgetUtilization > 80 
          ? "bg-amber-100 dark:bg-amber-900/30"
          : "bg-emerald-100 dark:bg-emerald-900/30",
      description: stats.budgetUtilization > 100 
        ? "Over budget" 
        : stats.budgetUtilization > 80 
          ? "Near limit"
          : "On track",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}