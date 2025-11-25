// app/budgets/page.tsx
"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { AddBudgetModal } from "@/components/budget/AddBudgetModal";
import { BudgetSummary } from "@/components/budget/BudgetSummary";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly";
}

const mockBudgets: Budget[] = [
  {
    id: 1,
    category: "Food & Dining",
    limit: 500,
    spent: 345.50,
    period: "monthly",
  },
  {
    id: 2,
    category: "Transportation",
    limit: 200,
    spent: 185.00,
    period: "monthly",
  },
  {
    id: 3,
    category: "Entertainment",
    limit: 150,
    spent: 95.99,
    period: "monthly",
  },
  {
    id: 4,
    category: "Shopping",
    limit: 300,
    spent: 425.50,
    period: "monthly",
  },
  {
    id: 5,
    category: "Bills & Utilities",
    limit: 400,
    spent: 389.50,
    period: "monthly",
  },
  {
    id: 6,
    category: "Healthcare",
    limit: 100,
    spent: 25.00,
    period: "weekly",
  },
];

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<"all" | "weekly" | "monthly">("all");

  const filteredBudgets = filterPeriod === "all" 
    ? budgets 
    : budgets.filter(b => b.period === filterPeriod);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id: number) => {
    console.log("Delete budget:", id);
    
    if (confirm("Are you sure you want to delete this budget?")) {
      setBudgets(budgets.filter(b => b.id !== id));
      toast.success("Budget deleted successfully!");
    }
  };

  return (
    <>
      <Navigation />
      <Toaster position="top-right" richColors closeButton />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Budgets
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Set spending limits and track your progress
                </p>
              </div>

              <div className="flex gap-2">
                <Select
                  value={filterPeriod}
                  onValueChange={(value: "all" | "weekly" | "monthly") => setFilterPeriod(value)}
                >
                  <SelectTrigger className="w-[140px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <Filter className="w-4 h-4 mr-2 text-emerald-600" />
                    <SelectValue placeholder="All Periods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAddBudget}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Budget
                </Button>
              </div>
            </div>
          </div>

          <BudgetSummary budgets={filteredBudgets} />

          {filteredBudgets.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <PlusCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No budgets found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filterPeriod === "all" 
                  ? "Get started by creating your first budget"
                  : `No ${filterPeriod} budgets found. Try a different filter.`
                }
              </p>
              {filterPeriod === "all" && (
                <Button
                  onClick={handleAddBudget}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Budget
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBudgets.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddBudgetModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        editBudget={editingBudget}
      />
    </>
  );
}