// app/api/budgets/[id]/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  createBudgetSchema,
  DataBudgetDescOptional,
} from "@/validations/budget.validation";
import { NextResponse } from "next/server";

export const GET = auth(async (req, context) => {
  if (!req.auth?.user?.id) {
    console.error("Unauthorized");
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const params = await context.params;
  const budgetId = params.id;

  if (!budgetId) {
    console.error("Budget ID is required");
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Budget ID is required",
      },
      { status: 400 },
    );
  }

  const userId = req.auth.user.id as string;

  try {
    const budget = await prisma.budgets.findUnique({
      where: {
        id: budgetId,
        userId: userId,
      },
      select: {
        id: true,
        month: true,
        year: true,
        totalAmount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!budget) {
      console.error("Budget not found");
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget not found",
        },
        { status: 404 },
      );
    }

    const reformattedBudget = {
      ...budget,
      id: budget.id,
      monthAndYear: new Date(budget.year, budget.month - 1).toLocaleDateString(
        "id-ID",
        {
          month: "long",
          year: "numeric",
        },
      ),
      totalAmount: budget.totalAmount,
      description: budget.description,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };

    const validateBudget = DataBudgetDescOptional.safeParse(reformattedBudget);

    if (!validateBudget.success) {
      console.error("Validation error:", validateBudget.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Invalid User Input",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Get Budget Success",
      data: validateBudget.data,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
});

export const PUT = auth(async (req, context) => {
  if (!req.auth?.user?.id) {
    console.error("Unauthorized");
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const params = await context.params;
  const budgetId = params.id;

  if (!budgetId) {
    console.error("Budget ID is required");
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Budget ID is required",
      },
      { status: 400 },
    );
  }

  const userId = req.auth.user.id as string;
  const data = await req.json();

  const validateBudget = createBudgetSchema.safeParse(data);

  if (!validateBudget.success) {
    console.error("Validation error:", validateBudget.error);
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Invalid User Input",
        errors: validateBudget.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const updateBudget = await prisma.budgets.update({
      where: {
        id: budgetId,
        userId: userId,
      },
      data: {
        month: validateBudget.data.month,
        year: validateBudget.data.year,
        totalAmount: validateBudget.data.totalAmount,
        description: validateBudget.data.description,
      },
    });
    return NextResponse.json({
      success: true,
      status: 200,
      message: "Update Budget Success",
      data: updateBudget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
});

export const DELETE = auth(async (req, context) => {
  if (!req.auth?.user?.id) {
    console.error("Unauthorized");
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const params = await context.params;
  const budgetId = params.id;

  if (!budgetId) {
    console.error("Budget ID is required");
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Budget ID is required",
      },
      { status: 400 },
    );
  }

  const userId = req.auth.user.id as string;

  try {
    const deleteBudget = await prisma.budgets.delete({
      where: {
        id: budgetId,
        userId: userId,
      },
    });

    console.log("Delete Budget Success");
    return NextResponse.json({
      success: true,
      status: 200,
      message: "Delete Budget Success",
      data: deleteBudget,
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
});
