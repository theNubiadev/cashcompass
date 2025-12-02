"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, PlusCircle, DollarSign, Wallet, Trash2, Edit2, TrendingUp, Upload } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const CATEGORIES = ["Groceries", "Rent", "Entertainment", "Utilities", "Transportation", "Healthcare", "Other"];

type Expense = {
  id: string;
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

type Budget = {
  userId: string;
  amount: number;
  period: "weekly" | "monthly";
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({ description: "", amount: "", category: "Groceries", date: "", receipt: null as File | null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [expensesRes, budgetRes] = await Promise.all([
        fetch("/api/expenses", { credentials: "same-origin" }),
        fetch("/api/budget", { credentials: "same-origin" }),
      ]);

      if (expensesRes.ok) {
        const data = await expensesRes.json();
        setExpenses(data.expenses || []);
        setBudgetStatus(data.budgetStatus);
      }

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudget(data.budget);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/expenses/${editingId}` : "/api/expenses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date || new Date().toISOString().split("T")[0],
        }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (res.ok) {
        if (editingId) {
          toast.success("Expense updated");
          setExpenses(expenses.map((e) => (e.id === editingId ? data.expense : e)));
          await fetchDashboardData();
        } else {
          toast.success(data.warning ? `Added! ${data.warning}` : "Expense added");
          setExpenses([data.expense, ...expenses]);
          if (data.warning) setBudgetStatus((prev) => (prev ? { ...prev, warning: true } : null));
        }
        resetForm();
      } else {
        const errorMsg = data?.error || "Failed to save expense";
        console.error("API Error:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Error saving expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (res.ok) {
        toast.success("Expense deleted");
        setExpenses(expenses.filter((e) => e.id !== id));
        await fetchDashboardData();
      } else {
        toast.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense");
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      receipt: null,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ description: "", amount: "", category: "Groceries", date: "", receipt: null });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const categorySpent = CATEGORIES.map((cat) => ({
    category: cat,
    amount: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.amount > 0);

  return (
    <>
      {/* <Navigation /> */}
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 md:ml-64">
        <div className="container mx-auto p-4 md:p-6 space-y-6 pt-24 md:pt-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your expenses and monitor your budget
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Expense
            </Button>
          </div>

          {/* Budget Status Cards */}
          {budget && budgetStatus && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={budgetStatus.warning ? "border-orange-300 bg-orange-50 dark:bg-orange-900/20" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">${budget.amount.toFixed(2)}</div>
                  <p className="text-xs text-gray-500 mt-1">{budget.period === "weekly" ? "Weekly" : "Monthly"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${budgetStatus.spent.toFixed(2)}</div>
                  <p className="text-xs text-gray-500 mt-1">{budgetStatus.percentage.toFixed(0)}% of budget</p>
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
                  <Progress value={Math.min(budgetStatus.percentage, 100)} className="mt-3" />
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
                  <h3 className="font-semibold text-orange-900 dark:text-orange-200">Budget Warning</h3>
                  <p className="text-sm text-orange-800 dark:text-orange-300 mt-1">
                    You&apos;ve spent {budgetStatus.percentage.toFixed(0)}% of your {budget?.period} budget. Be careful with your spending!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add/Edit Expense Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update your expense details" : "Add a new expense to track your spending"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Grocery shopping"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="receipt">Receipt (Optional)</Label>
                  <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="h-4 w-4 text-gray-600" />
                    <input
                      id="receipt"
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({ ...formData, receipt: file });
                        }
                      }}
                    />
                    <label htmlFor="receipt" className="flex-1 cursor-pointer">
                      <span className="text-sm text-gray-600">
                        {formData.receipt ? formData.receipt.name : "Click to upload receipt image or PDF"}
                      </span>
                    </label>
                  </div>
                  {formData.receipt && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, receipt: null })}
                      className="text-xs text-red-600 hover:text-red-700 mt-2"
                    >
                      Remove file
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    {editingId ? "Update" : "Add"} Expense
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Expenses by Category */}
          {categorySpent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categorySpent.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-gray-600 dark:text-gray-400">${item.amount.toFixed(2)}</span>
                      </div>
                      <Progress value={(item.amount / budgetStatus!.spent) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>{expenses.length} total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading expenses...</p>
              ) : expenses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No expenses yet. Add one to get started!</p>
              ) : (
                <div className="space-y-2">
                  {expenses.slice(0, 10).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">
                            {expense.category}
                          </span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}