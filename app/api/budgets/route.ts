"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  createBudgetSchema,
  formattedDataBudget,
} from "@/validations/budget.validation";
import { NextResponse } from "next/server";

export async function GET() {
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

  try {
    const getBudgets = await prisma.budgets.findMany({
      where: {
        userId: userId,
      },
      select: {
        month: true,
        year: true,
        totalAmount: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (getBudgets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget not found",
        },
        { status: 404 },
      );
    }
    type FormattedBudget = {
      monthAndYear: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalAmount: any;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
    };

    const formattedGetBudgets: FormattedBudget[] = getBudgets.map(budget => ({
      monthAndYear: new Date(budget.year, budget.month - 1).toLocaleDateString(
        "id-ID",
        {
          month: "long",
          year: "numeric",
        },
      ),
      totalAmount: budget.totalAmount.toNumber(),
      description: budget.description,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    }));

    console.log(Array.isArray(formattedGetBudgets));
    console.log(formattedGetBudgets);

    const validateData = formattedDataBudget.safeParse(formattedGetBudgets);

    if (!validateData.success) {
      console.error(validateData.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: validateData.error.message,
          errors: validateData.error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Get budgets successfully",
        data: validateData.data,
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
