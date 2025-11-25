"use client";

import { Navigation } from "@/components/Navbar";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  Calendar,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { toast, Toaster } from "sonner";

const CATEGORIES = ["Groceries", "Rent", "Entertainment", "Utilities", "Transportation", "Healthcare", "Other"];

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

const categoryColors: Record<string, string> = {
  Groceries: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Rent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  Utilities: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Transportation: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Healthcare: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
      } else {
        toast.error("Failed to load expenses");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error loading expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...expenses];

    // Search filter
    if (searchQuery) {
      result = result.filter((expense) =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (skip if "all-categories" or empty)
    if (filterCategory && filterCategory !== "all-categories") {
      result = result.filter((expense) => expense.category === filterCategory);
    }

    // Sort
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredExpenses(result);
  };

  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, searchQuery, filterCategory, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (res.ok) {
        toast.success("Expense deleted");
        setExpenses(expenses.filter((e) => e.id !== id));
      } else {
        toast.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense");
    }
  };

  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }

    const headers = ["Description", "Category", "Amount", "Date"];
    const rows = filteredExpenses.map((expense) => [
      expense.description,
      expense.category,
      expense.amount.toFixed(2),
      new Date(expense.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `expenses-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Expenses exported to CSV");
  };

  const exportToJSON = () => {
    if (filteredExpenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }

    const data = {
      exportDate: new Date().toISOString(),
      totalExpenses: filteredExpenses.length,
      totalAmount: filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
      expenses: filteredExpenses.map((e) => ({
        description: e.description,
        category: e.category,
        amount: parseFloat(e.amount.toFixed(2)),
        date: e.date,
      })),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `expenses-${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Expenses exported to JSON");
  };

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Navigation />
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              All Expenses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your expenses in one place
            </p>
          </div>

          {/* Filters & Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Export
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search" className="text-sm mb-2 block">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Label htmlFor="category" className="text-sm mb-2 block">
                    Category
                  </Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All categories</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <Label htmlFor="sort" className="text-sm mb-2 block">
                    Sort By
                  </Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="amount-desc">Highest Amount</SelectItem>
                      <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2 items-end">
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={isLoading || filteredExpenses.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                  <Button
                    onClick={exportToJSON}
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={isLoading || filteredExpenses.length === 0}
                  >
                    <FileText className="h-4 w-4" />
                    JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          {filteredExpenses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {filteredExpenses.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Amount</div>
                  <div className="text-2xl font-bold text-emerald-600">#{totalAmount.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Amount</div>
                  <div className="text-2xl font-bold text-blue-600">
                    #{(totalAmount / filteredExpenses.length).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Expense List</CardTitle>
              <CardDescription>
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">Description</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold text-right">Amount</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            No expenses found. Try adjusting your filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExpenses.map((expense) => (
                          <TableRow
                            key={expense.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <TableCell className="font-medium">{expense.description}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${categoryColors[expense.category] || categoryColors.Other}`}
                              >
                                {expense.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                              #{expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4" />
                                {new Date(expense.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(expense.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
