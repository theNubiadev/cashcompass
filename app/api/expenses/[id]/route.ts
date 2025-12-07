import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import * as z from "zod";

const updateExpenseSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  date: z.string().optional(),
});

// PUT - Update an expense
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenseId = id;

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate input
    const parsed = updateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Not needed for PUT
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

    // Check if expense exists and belongs to user
    const { data: existingExpense, error: checkError } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", expenseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Expense check error:", checkError);
      return NextResponse.json(
        { error: "Failed to check expense" },
        { status: 500 }
      );
    }

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Update expense - build update object with only provided fields
    const updateData: {
      description?: string;
      amount?: number;
      category?: string;
      date?: string;
    } = {};
    
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.amount !== undefined) updateData.amount = parsed.data.amount;
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
    if (parsed.data.date !== undefined) updateData.date = parsed.data.date;

    const { data: updatedExpense, error: updateError } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", expenseId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Expense update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update expense" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { expense: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/expenses/[id] PUT error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an expense
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenseId = id;

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense ID required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {
            // Not needed for DELETE
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

    // Check if expense exists and belongs to user
    const { data: existingExpense, error: checkError } = await supabase
      .from("expenses")
      .select("id")
      .eq("id", expenseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Expense check error:", checkError);
      return NextResponse.json(
        { error: "Failed to check expense" },
        { status: 500 }
      );
    }

    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Delete expense
    const { error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Expense delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete expense" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Expense deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/expenses/[id] DELETE error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}