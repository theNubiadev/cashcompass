import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import * as z from "zod";

const expenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().optional(),
});

function getPeriodStart(period: "weekly" | "monthly"): Date {
  const now = new Date();
  if (period === "weekly") {
    const day = now.getDay();
    const diff = now.getDate() - day;
    const startDate = new Date(now.setDate(diff));
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  } else {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    return startDate;
  }
}

// GET - Fetch user's expenses and budget status
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Not needed for GET request
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user's expenses
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (expensesError) {
      console.error("Expenses fetch error:", expensesError);
      return NextResponse.json(
        { error: "Failed to fetch expenses" },
        { status: 500 }
      );
    }

    // Fetch user's budget
    const { data: budget } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let budgetStatus = null;
    if (budget && expenses) {
      const periodStart = getPeriodStart(budget.period);
      const periodExpenses = expenses.filter(
        (e) => new Date(e.date) >= periodStart
      );
      const spent = periodExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;

      budgetStatus = {
        spent,
        remaining,
        percentage,
        warning: percentage >= 80,
      };
    }

    return NextResponse.json(
      { expenses: expenses || [], budgetStatus },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/expenses GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create a new expense
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = expenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { description, amount, category, date } = parsed.data;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Cookies handled by middleware
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Create new expense
    const { data: newExpense, error: insertError } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        description,
        amount,
        category,
        date: date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (insertError) {
      console.error("Expense insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create expense" },
        { status: 500 }
      );
    }

    // Check budget status for warnings
    const { data: budget } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let warning: string | null = null;
    if (budget) {
      const periodStart = getPeriodStart(budget.period);
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", periodStart.toISOString().split("T")[0]);

      if (expenses) {
        const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
        const percentage = (spent / budget.amount) * 100;

        if (percentage >= 80) {
          warning = `You've spent ${percentage.toFixed(0)}% of your ${budget.period} budget`;
        }
      }
    }

    return NextResponse.json(
      { expense: newExpense, warning },
      { status: 201 }
    );
  } catch (error) {
    console.error("/api/expenses POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}