"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { createBudgetSchema } from "@/validations/budget.validation";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string;

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const data = await req.json();

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Invalid User Input",
      },
      { status: 400 },
    );
  }

  const validateData = createBudgetSchema.safeParse(data);

  if (!validateData.success) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Invalid User Input",
        errors: validateData.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const addBudget = await prisma.budgets.create({
      data: {
        userId: userId,
        month: validateData.data.month,
        year: validateData.data.year,
        totalAmount: validateData.data.amount,
        description: validateData.data.description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "Budget created successfully",
        data: addBudget,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Error creating budget",
      },
      { status: 500 },
    );
  }
}
