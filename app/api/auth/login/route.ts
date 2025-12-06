"use server";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;
    //  Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

    if (authError) {
      console.error("Supabase auth error", authError);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Fetcch user profile from user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Supabase profile fetch error", profileError);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    //  create response with user data
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: authData.user.id,
          firstname: profile.first_name,
          lastname: profile.last_name,
          email: authData.user.email,
        },
      },
      { status: 200 }
    );

    //  Set Supabase session cookies
    //  supa
    res.cookies.set("sb-access-token", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("sb-refresh-token", authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (error) {
    console.error("/api/auth/login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
