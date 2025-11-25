import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";

type Budget = {
  userId: string;
  amount: number;
  period: "weekly" | "monthly";
  createdAt: string;
  updatedAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const BUDGETS_FILE = path.join(DATA_DIR, "budgets.json");

async function readBudgets(): Promise<Budget[]> {
  try {
    const raw = await fs.readFile(BUDGETS_FILE, "utf8");
    return JSON.parse(raw) as Budget[];
  } catch {
    return [];
  }
}

async function writeBudgets(budgets: Budget[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(BUDGETS_FILE, JSON.stringify(budgets, null, 2), "utf8");
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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const budgets = await readBudgets();
    const userBudget = budgets.find((b) => b.userId === payload.sub);

    return NextResponse.json({ budget: userBudget || null }, { status: 200 });
  } catch (error) {
    console.error("/api/budget GET error:", error);
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
    const { amount, period } = body;

    if (!amount || !period || !["weekly", "monthly"].includes(period)) {
      return NextResponse.json({ error: "Invalid amount or period" }, { status: 400 });
    }

    const budgets = await readBudgets();
    const existingIndex = budgets.findIndex((b) => b.userId === payload.sub);

    const now = new Date().toISOString();
    const newBudget: Budget = { 
      userId: payload.sub, 
      amount: parseFloat(amount), 
      period, 
      createdAt: existingIndex === -1 ? now : budgets[existingIndex].createdAt, 
      updatedAt: now 
    };

    if (existingIndex === -1) {
      budgets.push(newBudget);
    } else {
      budgets[existingIndex] = newBudget;
    }

    await writeBudgets(budgets);
    return NextResponse.json({ budget: newBudget }, { status: 201 });
  } catch (error) {
    console.error("/api/budget POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
