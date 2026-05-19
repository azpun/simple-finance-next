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
        budget: {
          select: {
            id: true,
            month: true,
            year: true,
            totalAmount: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
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

    const getTransactionsByCategories = await prisma.transactions.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        category: {
          type: "Expense",
        },
      },
    });

    if (getTransactionsByCategories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Transactions not found",
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

    const data = validateBudgetCategories.data.map(item => {
      return {
        id: item.id,
        budgetId: item.budget.id,
        budgetMonthAndYear: new Date(
          item.budget.year,
          item.budget.month,
        ).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        }),
        budgetTotalAmount: item.budget.totalAmount,
        categoryId: item.category.id,
        categoryName: item.category.name,
        categoryType: item.category.type,
        categorySumAmount: getTransactionsByCategories.find(
          itemTransaction => itemTransaction.categoryId === item.category.id,
        )?._sum.amount,
        amountBudgetCategory: item.amount,
      };
    });

    const dataReformatted = data.map(item => {
      return {
        ...item,
        categorySumAmount: Number(item.categorySumAmount),
      };
    });

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Get budget categories successfully",
        data: dataReformatted,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
  }
});
