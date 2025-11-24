"use client";

import { Navigation } from "@/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navigation />
      <div className="">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your expenses and budgets
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
