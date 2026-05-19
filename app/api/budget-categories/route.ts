import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { FormValues } from "@/types/budgetCategories";
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
