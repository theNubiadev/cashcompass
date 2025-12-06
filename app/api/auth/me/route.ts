import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

interface SafeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{name: string; value: string; options?: any}>) {
            // Not needed for GET request, but required by the API
          },
        },
      }
    );

    // Get the authenticated user from Supabase session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user profile from user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email")
      .eq("id", authUser.id)
      .single();

    if (profileError) {
      console.error("Supabase profile error:", profileError);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const safeUser: SafeUser = {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}