// components/budgets/AddBudgetModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: "weekly" | "monthly";
}

interface AddBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBudget?: Budget | null;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Other"
];

const periods = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function AddBudgetModal({ open, onOpenChange, editBudget = null }: AddBudgetModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "weekly" | "monthly",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editBudget) {
      setFormData({
        category: editBudget.category,
        limit: editBudget.limit.toString(),
        period: editBudget.period,
      });
    } else {
      setFormData({
        category: "",
        limit: "",
        period: "monthly",
      });
    }
  }, [editBudget, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Budget data:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(editBudget ? "Budget updated successfully!" : "Budget created successfully!");
      onOpenChange(false);
      
      if (!editBudget) {
        setFormData({
          category: "",
          limit: "",
          period: "monthly",
        });
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to save budget. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editBudget ? "Edit Budget" : "Create New Budget"}
          </DialogTitle>
          <DialogDescription>
            {editBudget 
              ? "Update your budget limits and track your spending" 
              : "Set spending limits for different categories to stay on track"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Budget Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData({ ...formData, period: value as "weekly" | "monthly" })}
              required
            >
              <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit ($)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
            <p className="text-xs text-gray-500">
              Set a {formData.period} spending limit for this category
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : editBudget ? "Update Budget" : "Create Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}