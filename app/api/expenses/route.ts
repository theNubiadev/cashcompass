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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const expenses = await readExpenses();
    const userExpenses = expenses.filter((e) => e.userId === payload.sub);

    const budgets = await readBudgets();
    const userBudget = budgets.find((b) => b.userId === payload.sub);

    let budgetStatus = null;
    if (userBudget) {
      budgetStatus = calculateBudgetStatus(payload.sub, userBudget, expenses);
    }

    return NextResponse.json({ expenses: userExpenses, budgetStatus }, { status: 200 });
  } catch (error) {
    console.error("/api/expenses GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const { description, amount, category, date } = body;

    if (!description || !amount || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const expenses = await readExpenses();
    const newExpense: Expense = {
      id: Date.now().toString(),
      userId: payload.sub,
      description,
      amount: parseFloat(amount),
      category,
      date: date || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);

    // Check budget status for warnings
    const budgets = await readBudgets();
    const userBudget = budgets.find((b) => b.userId === payload.sub);
    let warning = null;
    if (userBudget) {
      const status = calculateBudgetStatus(payload.sub, userBudget, expenses);
      if (status.warning) {
        warning = `You've spent ${status.percentage.toFixed(0)}% of your ${userBudget.period} budget`;
      }
    }

    return NextResponse.json({ expense: newExpense, warning }, { status: 201 });
  } catch (error) {
    console.error("/api/expenses POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
