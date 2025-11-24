
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with actual API call
const mockBudgets = {
  total: 5000,
  used: 2450.75,
  remaining: 2549.25,
  percentUsed: 49,
};

export function BudgetOverview() {
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    setTimeout(() => setIsLoading(false), 1400);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Monthly budget status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Monthly budget status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Budget Used</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            #{mockBudgets.used.toFixed(2)} / #{mockBudgets.total.toFixed(2)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                mockBudgets.percentUsed > 80 
                  ? 'bg-red-500' 
                  : mockBudgets.percentUsed > 60 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
              style={{ width: `${mockBudgets.percentUsed}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{mockBudgets.percentUsed}% used</span>
            <span>#{mockBudgets.remaining.toFixed(2)} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              #{mockBudgets.total.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Remaining</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              #{mockBudgets.remaining.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}