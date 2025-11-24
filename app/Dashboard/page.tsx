"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, Wallet, Target, BarChart3 } from "lucide-react";
import {  Toaster } from "sonner";

// Import dashboard components
 import { SummaryCard } from "@/components/Summary";
 import { RecentExpenses } from "@/components/RecentExpense";
 import { BudgetOverview } from "@/components/BudgetOverview";
import { AddExpenseModal } from "@/components/AddExpense";

// Mock data - replace with actual API calls
const mockExpenses = {
  total: 2450.75,
  thisMonth: 1250.50,
  lastMonth: 1200.25,
  percentChange: 4.2,
};

const mockBudgets = {
  total: 5000,
  used: 2450.75,
  remaining: 2549.25,
  percentUsed: 49,
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Navigation />
      <Toaster position="top-right" richColors closeButton />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Overview of your expenses and budgets
              </p>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Expense
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Total Expenses"
              value={mockExpenses.total}
              icon={DollarSign}
              trend="up"
              trendValue={mockExpenses.percentChange}
              color="emerald"
            />
            <SummaryCard
              title="This Month"
              value={mockExpenses.thisMonth}
              icon={Wallet}
              color="blue"
            />
            <SummaryCard
              title="Budget Used"
              value={mockBudgets.used}
              icon={Target}
              color="amber"
            />
            <SummaryCard
              title="Remaining"
              value={mockBudgets.remaining}
              icon={BarChart3}
              color="emerald"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <RecentExpenses />
            <BudgetOverview />
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}