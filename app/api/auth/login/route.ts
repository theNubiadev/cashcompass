"use server";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    passwordHash: string;
    createdAt?: string;
};

async function readUsers(): Promise<User[]> {
    try {
        const raw = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(raw) as User[];
    } catch {
        return [];
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const { email, password } = parsed.data;
        const users = await readUsers();

        const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Successful login - issue a JWT and set it as an HTTP-only cookie
        const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-this";
        const token = jwt.sign(payload, secret, { expiresIn: "7d" });

        const res = NextResponse.json({ message: "Login successful", user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } }, { status: 200 });
        // Set cookie options: httpOnly, secure in production, sameSite lax, path=/, 7 days
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    } catch (error) {
        console.error("/api/auth/login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}