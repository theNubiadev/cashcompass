"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, DollarSign  } from "lucide-react";
import { toast } from "sonner";

type Period = "weekly" | "monthly";

export default function Onboarding() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<Period>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user already has a budget
  useEffect(() => {
    const checkBudget = async () => {
      try {
        const res = await fetch("/api/budget", { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          if (data.budget) {
            // User already has a budget, redirect to dashboard
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking budget:", error);
      } finally {
        setIsChecking(false);
      }
    };
    checkBudget();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), period }),
        credentials: "same-origin",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to set budget");
        return;
      }

      toast.success("Budget set successfully! Redirecting to dashboard...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      console.error("Setup budget error:", error);
      toast.error("Failed to set budget. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Compass className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p>Checking your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-2xl border-emerald-100 dark:border-gray-700">
         <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex items-center justify-center gap-2">
            <Compass className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            <CardTitle className="text-3xl font-bold">Welcome!</CardTitle>
          </div>
          <CardDescription className="text-base">
            Let&apos;s set up your budget to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Budget Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Budget Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Period Selection */}
            <div className="space-y-3">
              <Label className="text-gray-700 dark:text-gray-300">Budget Period</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${
                      period === p
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-emerald-500"
                    }`}
                  >
                    {p === "weekly" ? "Weekly" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all mt-8"
            >
              {isLoading ? "Setting up..." : "Let's Get Started"}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            You can change your budget anytime from your dashboard settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
