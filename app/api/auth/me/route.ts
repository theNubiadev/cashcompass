import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  passwordHash: string;
  createdAt?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join (DATA_DIR, "users.json");

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const secret = process.env.JWT_SECRET;
    let payload: any;
    try {
      payload = jwt.verify(token, secret!) as any;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const users = await readUsers();
    const user = users.find((u) => u.id === payload.sub);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const safeUser = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
