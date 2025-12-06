"use server";

import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
      parsed.data;
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }
    //  Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
       email_confirm: false, // Auto-confirm email, can also be set to false
    })

    if (authError) {
      console.error("Supabase auth error", authError);
      return NextResponse.json(
        { error: "Failed to create auth user" },
        { status: 500 }
      );
    }
    // Create user profile 
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        id: authData.user.id, // use the auth user's id
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        phone_number: phoneNumber || null,
      })
    if (profileError) {
      console.error("Supabase profile error", profileError);
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("/api/auth/register error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
