import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { DataBudgetType } from "@/validations/budget.validation";
import { NextResponse } from "next/server";

export const GET = auth(async (req, context) => {
  if (!req.auth?.user?.id) {
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
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget not found",
        },
        { status: 404 },
      );
    }

    const formattedGetBudgets: DataBudgetType = {
      id: budget.id,
      monthAndYear: new Date(budget.year, budget.month - 1).toLocaleDateString(
        "id-ID",
        {
          month: "long",
          year: "numeric",
        },
      ),
      totalAmount: budget.totalAmount.toNumber(),
      description: budget.description || undefined,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Get Budget Success",
      data: formattedGetBudgets,
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
