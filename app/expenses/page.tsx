"use client";

import { Navigation } from "@/components/Navbar";
import { RecentExpenses } from "@/components/RecentExpense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead } from "@/components/ui/table";
import { Filter } from "lucide-react";
export default function Expense() {
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

                  <Table>
                      <TableBody><TableHead>Home</TableHead></TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
