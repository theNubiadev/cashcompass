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
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-this";
    const payload = jwt.verify(token, secret) as { sub: string };
    return payload;
  } catch {
    return null;
  }
}

function generateAIInsights(
  userId: string,
  expenses: Expense[],
  budget: Budget | null
): {
  summary: string;
  recommendations: string[];
  anomalies: string[];
  categoryBreakdown: Record<string, number>;
  topCategory: string;
  savings: string;
} {
  // Filter expenses for this user
  const userExpenses = expenses.filter((e) => e.userId === userId);

  if (userExpenses.length === 0) {
    return {
      summary: "No expenses tracked yet. Start adding expenses to get personalized insights!",
      recommendations: [
        "Begin tracking your expenses to understand your spending patterns",
        "Set a budget to stay on top of your finances",
        "Categorize expenses for better insights",
      ],
      anomalies: [],
      categoryBreakdown: {},
      topCategory: "N/A",
      savings: "Start tracking to see potential savings",
    };
  }

  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = {};
  userExpenses.forEach((expense) => {
    categoryBreakdown[expense.category] =
      (categoryBreakdown[expense.category] || 0) + expense.amount;
  });

  // Find top category
  const topCategory =
    Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

  // Calculate statistics
  const totalSpent = userExpenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = userExpenses.filter((e) => {
    const date = new Date(e.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  // Generate recommendations
  const recommendations: string[] = [];

  if (budget) {
    const spent = thisMonthTotal;
    const percentUsed = (spent / budget.amount) * 100;

    if (percentUsed > 80) {
      recommendations.push(
        `⚠️ You've spent ${percentUsed.toFixed(0)}% of your ${budget.period} budget ($${spent.toFixed(
          2
        )}). Consider reducing expenses in ${topCategory} to stay within limits.`
      );
    } else if (percentUsed > 50) {
      recommendations.push(
        `💡 You're at ${percentUsed.toFixed(0)}% of your ${budget.period} budget. Keep an eye on ${topCategory} spending.`
      );
    } else {
      recommendations.push(
        `✅ Great job! You're only at ${percentUsed.toFixed(0)}% of your ${budget.period} budget.`
      );
    }
  }

  // Category-specific insights
  if (categoryBreakdown[topCategory] > 500) {
    recommendations.push(
      `Your highest spending is on ${topCategory} ($${categoryBreakdown[topCategory].toFixed(
        2
      )}). Consider if you can reduce this category by 10-20%.`
    );
  }

  if (categoryBreakdown["Entertainment"]) {
    recommendations.push(
      `You spent $${categoryBreakdown["Entertainment"].toFixed(2)} on Entertainment. This is a discretionary category - consider setting a stricter limit.`
    );
  }

  // Detect spending increases
  const last7Days = userExpenses.filter((e) => {
    const date = new Date(e.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo;
  });
  const last7DaysTotal = last7Days.reduce((sum, e) => sum + e.amount, 0);
  const last7DaysAvgDaily = last7Days.length > 0 ? last7DaysTotal / 7 : 0;

  recommendations.push(
    `Your average daily spending is $${last7DaysAvgDaily.toFixed(2)}. At this rate, you'll spend $${(
      last7DaysAvgDaily * 30
    ).toFixed(2)} per month.`
  );

  // Calculate potential savings
  const canSave = Object.entries(categoryBreakdown)
    .filter(([cat]) => ["Entertainment", "Shopping"].includes(cat))
    .reduce((sum, [, amount]) => sum + amount * 0.1, 0); // 10% reduction potential

  // Generate summary
  const summary =
    userExpenses.length > 0
      ? `You've tracked ${userExpenses.length} expenses totaling $${totalSpent.toFixed(
          2
        )}. Your most expensive category is ${topCategory}. Based on your spending patterns, we've identified some opportunities to optimize your budget.`
      : "Start tracking your expenses to unlock personalized insights!";

  // Detect anomalies
  const anomalies: string[] = [];
  const avgByCategory: Record<string, number> = {};
  Object.entries(categoryBreakdown).forEach(([cat, total]) => {
    const count = userExpenses.filter((e) => e.category === cat).length;
    avgByCategory[cat] = total / count;
  });

  // Find transactions significantly above average
  userExpenses.slice(-10).forEach((expense) => {
    const categoryAvg = avgByCategory[expense.category] || 0;
    if (expense.amount > categoryAvg * 2) {
      anomalies.push(
        `🔴 Unusual: $${expense.amount.toFixed(2)} on "${expense.description}" is significantly higher than your average ${expense.category} purchase ($${categoryAvg.toFixed(
          2
        )})`
      );
    }
  });

  return {
    summary,
    recommendations: recommendations.slice(0, 5), // Limit to top 5
    anomalies,
    categoryBreakdown,
    topCategory,
    savings: canSave > 0 ? `$${canSave.toFixed(2)} per month` : "N/A",
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const expenses = await readExpenses();
    const budgets = await readBudgets();
    const userBudget = budgets.find((b) => b.userId === payload.sub);

    const insights = generateAIInsights(payload.sub, expenses, userBudget || null);

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("/api/ai/insights GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
