import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import * as z from "zod";

const budgetSchema = z.object({
  amount: z.number().positive(),
  period: z.enum(["weekly", "monthly"]),
});

// GET - Fetch user's budget
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Not needed for GET request
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user's budget
    const { data: budget, error: budgetError } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (budgetError) {
      console.error("Budget fetch error:", budgetError);
      return NextResponse.json(
        { error: "Failed to fetch budget" },
        { status: 500 }
      );
    }

    return NextResponse.json({ budget }, { status: 200 });
  } catch (error) {
    console.error("/api/budget GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - Create or update user's budget
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = budgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { amount, period } = parsed.data;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Not needed for POST
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if budget already exists
    const { data: existingBudget } = await supabase
      .from("budgets")
      .select("id, created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingBudget) {
      // Update existing budget
      const { data: updatedBudget, error: updateError } = await supabase
        .from("budgets")
        .update({
          amount,
          period,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Budget update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update budget" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { budget: updatedBudget, message: "Budget updated successfully" },
        { status: 200 }
      );
    } else {
      // Create new budget
      const { data: newBudget, error: insertError } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          amount,
          period,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Budget insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to create budget" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { budget: newBudget, message: "Budget created successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("/api/budget POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}