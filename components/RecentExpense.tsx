
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

// Mock data - replace with actual API call
const recentExpenses = [
  { id: 1, category: "Food", amount: 45.50, date: "2024-11-23", description: "Grocery shopping" },
  { id: 2, category: "Transport", amount: 25.00, date: "2024-11-23", description: "Uber ride" },
  { id: 3, category: "Entertainment", amount: 60.00, date: "2024-11-22", description: "Movie tickets" },
];

export function RecentExpenses() {
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {expense.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {expense.date} • {expense.category}
                </p>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                #{expense.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}