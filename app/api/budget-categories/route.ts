import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { FormValues } from "@/types/budgetCategories";
import { budgetCategoriesDataSchema } from "@/validations/budgetCategories.validation";
import { NextResponse } from "next/server";

export const POST = auth(async req => {
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

  //   const userId = req.auth.user.id as string;
  const data: FormValues = await req.json();

  try {
    const postDataBudgetCategories = await prisma.budgetCategory.create({
      data: {
        budgetId: data.budgetId,
        categoryId: data.categoryId,
        amount: data.amount,
      },
      include: {
        budget: true,
        category: true,
      },
    });

    console.log(postDataBudgetCategories);

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Budget category created successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
  }
});

export const GET = auth(async req => {
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

  const userId = req.auth.user.id as string;

  try {
    const getDataBudgetCategories = await prisma.budgetCategory.findMany({
      where: {
        budget: {
          userId: userId,
        },
      },
      include: {
        budget: true,
        category: true,
      },
    });

    if (getDataBudgetCategories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget categories not found",
        },
        { status: 404 },
      );
    }

    const validateBudgetCategories = budgetCategoriesDataSchema
      .array()
      .safeParse(getDataBudgetCategories);

    if (!validateBudgetCategories.success) {
      console.error(validateBudgetCategories.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Invalid User Input",
        },
        { status: 400 },
      );
    }

    console.log(validateBudgetCategories);

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Get budget categories successfully",
        data: getDataBudgetCategories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
  }
});
