import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";

type Expense = {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
};

type Budget = {
  userId: string;
  amount: number;
  period: "weekly" | "monthly";
};

const DATA_DIR = path.join(process.cwd(), "data");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const BUDGETS_FILE = path.join(DATA_DIR, "budgets.json");

async function readExpenses(): Promise<Expense[]> {
  try {
    const raw = await fs.readFile(EXPENSES_FILE, "utf8");
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

async function writeExpenses(expenses: Expense[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(EXPENSES_FILE, JSON.stringify(expenses, null, 2), "utf8");
}

async function readBudgets(): Promise<Budget[]> {
  try {
    const raw = await fs.readFile(BUDGETS_FILE, "utf8");
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

function verifyToken(token: string): { sub: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret!) as { sub: string };
    return payload;
  } catch {
    return null;
  }
}

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

function calculateBudgetStatus(userId: string, userBudget: Budget, expenses: Expense[]): { spent: number; remaining: number; percentage: number; warning: boolean } {
  const periodStart = getPeriodStart(userBudget.period);
  const periodExpenses = expenses.filter((e) => e.userId === userId && new Date(e.date) >= periodStart);
  const spent = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = userBudget.amount - spent;
  const percentage = (spent / userBudget.amount) * 100;

  return {
    spent,
    remaining,
    percentage,
    warning: percentage >= 80,
  };
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const expenseId = id;

    if (!expenseId) {
      return NextResponse.json({ error: "Expense ID required" }, { status: 400 });
    }

    const body = await req.json();
    const { description, amount, category, date } = body;

    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex((e) => e.id === expenseId && e.userId === payload.sub);

    if (expenseIndex === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      description: description || expenses[expenseIndex].description,
      amount: amount ? parseFloat(amount) : expenses[expenseIndex].amount,
      category: category || expenses[expenseIndex].category,
      date: date || expenses[expenseIndex].date,
    };

    await writeExpenses(expenses);

    return NextResponse.json({ expense: expenses[expenseIndex] }, { status: 200 });
  } catch (error) {
    console.error("/api/expenses/[id] PUT error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const expenseId = id;

    if (!expenseId) {
      return NextResponse.json({ error: "Expense ID required" }, { status: 400 });
    }

    const expenses = await readExpenses();
    const expenseIndex = expenses.findIndex((e) => e.id === expenseId && e.userId === payload.sub);

    if (expenseIndex === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    expenses.splice(expenseIndex, 1);
    await writeExpenses(expenses);

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("/api/expenses/[id] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
