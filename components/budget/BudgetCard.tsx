// components/budgets/BudgetCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2, AlertTriangle, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly";
}

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentUsed = (budget.spent / budget.limit) * 100;
  const remaining = budget.limit - budget.spent;
  const isOverBudget = percentUsed > 100;
  const isNearLimit = percentUsed > 80 && !isOverBudget;

  const getProgressColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isNearLimit) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getPeriodText = () => {
    if (budget.period === "weekly") return "This Week";
    if (budget.period === "monthly") return "This Month";
    return budget.period;
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
            {budget.category}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {getPeriodText()}
          </Badge>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(budget)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Budget
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(budget.id)} 
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${budget.spent.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              of ${budget.limit.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${
              isOverBudget 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {isOverBudget ? '-' : ''}${Math.abs(remaining).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isOverBudget ? 'over budget' : 'remaining'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={Math.min(percentUsed, 100)} 
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{percentUsed.toFixed(1)}% used</span>
            {isOverBudget && (
              <span className="text-red-600 dark:text-red-400 font-medium">
                {(percentUsed - 100).toFixed(1)}% over
              </span>
            )}
          </div>
        </div>

        {isOverBudget && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-600 dark:text-red-400">
              <p className="font-medium">Budget exceeded!</p>
              <p>You&apos;ve spent ${(budget.spent - budget.limit).toFixed(2)} more than planned.</p>
            </div>
          </div>
        )}

        {isNearLimit && !isOverBudget && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-600 dark:text-amber-400">
              <p className="font-medium">Approaching limit</p>
              <p>You have ${remaining.toFixed(2)} left in this budget.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}