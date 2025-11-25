"use client";

import { Navigation } from "@/components/Navbar";
import { RecentExpenses } from "@/components/RecentExpense";
import { useState } from "react";
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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { toast } from "sonner";
// Mock data - replace with actual API call
const mockExpenses = [
  {
    id: 1,
    description: "Grocery shopping at Whole Foods",
    category: "Food & Dining",
    amount: 145.5,
    date: "2024-11-23",
    paymentMethod: "Credit Card",
    status: "completed",
  },
  {
    id: 2,
    description: "Uber ride to airport",
    category: "Transportation",
    amount: 45.0,
    date: "2024-11-23",
    paymentMethod: "Debit Card",
    status: "completed",
  },
  {
    id: 3,
    description: "Netflix subscription",
    category: "Entertainment",
    amount: 15.99,
    date: "2024-11-22",
    paymentMethod: "Credit Card",
    status: "pending",
  },
  {
    id: 4,
    description: "Electricity bill",
    category: "Bills & Utilities",
    amount: 89.5,
    date: "2024-11-21",
    paymentMethod: "Bank Transfer",
    status: "completed",
  },
  {
    id: 5,
    description: "Coffee at Starbucks",
    category: "Food & Dining",
    amount: 6.75,
    date: "2024-11-21",
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: 6,
    description: "Online course - Udemy",
    category: "Education",
    amount: 49.99,
    date: "2024-11-20",
    paymentMethod: "Credit Card",
    status: "completed",
  },
  {
    id: 7,
    description: "New running shoes",
    category: "Shopping",
    amount: 129.99,
    date: "2024-11-19",
    paymentMethod: "Debit Card",
    status: "completed",
  },
  {
    id: 8,
    description: "Doctor appointment",
    category: "Healthcare",
    amount: 75.0,
    date: "2024-11-18",
    paymentMethod: "Cash",
    status: "completed",
  },
];
const categoryColors = {
  "Food & Dining":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  Transportation:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Entertainment:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "Bills & Utilities":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Education:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  Shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  Healthcare:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function Expenses({ searchQuery = "", filterCategory = "" }) {
  const [isLoading, setIsLoading] = useState(false);

  //  Filter expesnes based on search and category
  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: string) => {
    console.log("Edit expense:", id);
    toast.success("Edit expense");
  };

  const handleDelete = (id: string) => {
    console.log("Delete expense:", id);
    toast.error("Delete expense")
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>Complete list of your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl text-emerald-600 md:text-4xl font-bold dark:text-white mb-2">
                Check your expenses
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Overview of your expenses in a tabular form{" "}
              </p>
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-600 rounded  "
              >
                <Filter className="w-4 h-4 " />
                <span>Filter view</span>
              </Button>

              <Input placeholder="Search" className="text-emerald-600 " />
            </div>
          </div>

          {/* Main Content */}
          <RecentExpenses />

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>
                {filteredExpenses.length} transaction
                {filteredExpenses.length !== 1 ? "s" : ""} found
              </CardDescription>
              <CardContent>
                <div className="rounded-md border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold">
                          Description
                        </TableHead>
                        <TableHead className="font-semibold">
                          Category
                        </TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">
                          Payment Method
                        </TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
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
                            <TableCell className="font-medium">
                              {expense.description}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`${
                                  categoryColors[expense.category]
                                } font-medium`}
                              >
                                {expense.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-gray-900 dark:text-white">
                              ${expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-3 w-3" />
                                {expense.date}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <CreditCard className="h-3 w-3" />
                                {expense.paymentMethod}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  expense.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  expense.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                }
                              >
                                {expense.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(expense.id)}
                                    className="cursor-pointer text-green-600"
                                  >
                                    <Pencil className="mr-2 h-4 w-4 text-green-600  " />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(expense.id)}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
