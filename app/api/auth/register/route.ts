"use server";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import * as z from "zod";

const userSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
});

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function readUsers() {
    try {
        const raw = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        return [];
    }
}

async function writeUsers(users: any[]) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = userSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const { firstName, lastName, email, phoneNumber, password, confirmPassword } = parsed.data;

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const users = await readUsers();

        const existing = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email: email.toLowerCase(),
            phoneNumber: phoneNumber || null,
            passwordHash: hashed,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        await writeUsers(users);

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        console.error("/api/auth/register error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}