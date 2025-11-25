// components/analytics/MonthlyComparisonChart.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

interface MonthlyData {
  month: string;
  expenses: number;
  budget: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Expenses: ${payload[0].value.toFixed(2)}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Budget: ${payload[1].value.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {payload[0].value > payload[1].value ? "Over budget" : "Under budget"}
        </p>
      </div>
    );
  }
  return null;
};

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Expenses vs Budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
          Monthly Comparison
        </CardTitle>
        <CardDescription>Compare your expenses against your budget over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="expenses" 
              fill="#059669" 
              name="Expenses"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="budget" 
              fill="#3b82f6" 
              name="Budget"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}