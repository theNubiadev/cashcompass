"use client";

import Link from "next/link";
import { Navigation } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
export default function Dashboard() {
  return (
    <>
      <Navigation />
      <div className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your expenses and budgets
            </p>
          </div>

          <Button asChild>
            <Link href="/add-expense" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4 " />
              Add Expense
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
