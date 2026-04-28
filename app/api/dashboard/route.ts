// app/api/dashboard/route.ts
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";
import { dashboardDataSchema } from "@/validations/dashboard.validation";
// import { Decimal } from "@prisma/client/runtime/library"; // Cannot find module '@prisma/client/runtime/library' or its corresponding type declarations.

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  const nowUtc = new Date();
  const month = nowUtc.getMonth() + 1; // Months are zero-indexed
  const year = nowUtc.getFullYear();
  // const nowLocal = toZonedTime(nowUtc, timezone);

  const referenceDate = new Date(year, month - 1); // First day of the current month

  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);
  try {
    const transactionsDate = await prisma.transactions.findMany({
      where: {
        userId: userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
        amount: true,
        title: true,
        type: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const transactionGroupByCategories = await prisma.transactions.groupBy({
      by: ["categoryId"],
      where: {
        userId: userId,
        type: "Expense",
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const total = transactionGroupByCategories.reduce<number>((total, item) => {
      const { _sum } = item;
      if (_sum) {
        total += _sum.amount?.toNumber() ?? 0; // Operator '+=' cannot be applied to types 'number' and 'number | Decimal'.
      }
      return total;
    }, 0);

    const categoryids = transactionGroupByCategories.map(
      item => item.categoryId,
    );

    const categories = await prisma.categories.findMany({
      where: {
        id: {
          in: categoryids,
        },
      },
    });

    // Buat Map untuk lookup kategori berdasarkan categoryId
    const category = new Map(
      categories.map(category => [category.id, category]),
    );

    const withPercentage = transactionGroupByCategories.map(item => {
      const { _sum } = item;
      if (_sum) {
        return {
          ...item,
          category: category?.get(item.categoryId)?.name,
          percentage: ((_sum.amount?.toNumber() ?? 0) / total) * 100, // The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
        };
      }
      return {
        ...item,
        category: category?.get(item.categoryId)?.name,
        percentage: 0,
      };
    });

    const sortedWithPercentage = [...withPercentage].sort((a, b) => {
      // Sort berdasarkan yang terbesar
      return b.percentage - a.percentage;
    });

    const result = {
      transactions: transactionsDate,
      byCategories: sortedWithPercentage,
      sumOfExpanses: total,
    };

    const validate = dashboardDataSchema.safeParse(result);

    if (!validate.success) {
      console.error("Validation error:", validate.error);
      return NextResponse.json(
        {
          success: false,
          status: 500,
          message: "Error validating dashboard data",
          errors: validate.error.flatten(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transactions fetched successfully",
      data: validate.data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Failed to fetch transactions",
      error: error,
    });
  }
}
