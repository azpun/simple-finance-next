import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  createBudgetSchema,
  DataBudgetWitStats,
  DataBudgetWitStatsType,
} from "@/validations/budget.validation";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
  const userId = session.user.id as string;

  try {
    const dataBudgets = await prisma.budgets.findMany({
      where: {
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
      orderBy: {
        month: "asc",
      },
    });

    if (dataBudgets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget not found",
        },
        { status: 404 },
      );
    }

    const dataBudgetWithStats: DataBudgetWitStatsType[] = await Promise.all(
      dataBudgets.map(async budget => {
        const startMonth = startOfMonth(
          new Date(budget.year, budget.month - 1, 1),
        );
        const endMonth = endOfMonth(
          new Date(budget.year, budget.month, 0, 23, 59, 59),
        );
        const dataTransaction = await prisma.transactions.aggregate({
          where: {
            userId: userId,
            type: "Expense",
            date: {
              gte: startMonth,
              lte: endMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const remaining =
          Number(budget.totalAmount) - Number(dataTransaction._sum.amount);

        const percentageUsage =
          (Number(dataTransaction._sum.amount) / Number(budget.totalAmount)) *
          100;

        return {
          // ...budget,
          id: budget.id,
          monthAndYear: new Date(
            budget.year,
            budget.month - 1,
          ).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          description: budget.description,
          totalAmount: Number(budget.totalAmount),
          totalExpense: {
            amount: Number(dataTransaction._sum.amount),
          },
          remaining: remaining,
          percentageUsage: percentageUsage,
        };
      }),
    );

    const validateDataWithStats =
      DataBudgetWitStats.array().safeParse(dataBudgetWithStats);

    if (!validateDataWithStats.success) {
      console.error(validateDataWithStats.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: validateDataWithStats.error.message,
          errors: validateDataWithStats.error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Get budgets successfully",
        data: validateDataWithStats.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Error fetching budgets",
      },
      { status: 500 },
    );
  }
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
        totalAmount: validateData.data.totalAmount,
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
