import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => 
              req.cookies.set(name, value)
            );
          },
        },
      }
    );

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Supabase signout error:", error);
      return NextResponse.json(
        { error: "Failed to sign out" },
        { status: 500 }
      );
    }

    const res = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear all Supabase session cookies
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
    ];

    cookiesToClear.forEach(cookieName => {
      res.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    });

    return res;
  } catch (error) {
    console.error("/api/auth/logout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}