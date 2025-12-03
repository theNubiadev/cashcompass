"use server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const { email, password } = parsed.data;
        const { data: user, error: userRError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .maybeSingle();

        if (userRError) {
            console.error("Supabase fetch error:", userRError);
            return NextResponse.json({ error: "Internal Server Error" },
                { status: 500 });  
         }
            if (!user) {
                return NextResponse.json({ error: "Invalid email or password" },
                { status: 401 });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Successful login - issue a JWT and set it as an HTTP-only cookie
        const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret!, { expiresIn: "7d" });

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