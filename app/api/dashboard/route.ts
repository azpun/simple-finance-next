// app/api/dashboard/route.ts
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";

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
        type: "EXPENSE",
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
        total += _sum.amount ?? 0;
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

    const withPercentage = transactionGroupByCategories.map(item => {
      // Buat Map untuk lookup kategori berdasarkan categoryId
      const category = new Map(
        categories.map(category => [category.id, category]),
      );

      const { _sum } = item;
      if (_sum) {
        return {
          ...item,
          category: category?.get(item.categoryId)?.name,
          percentage: ((_sum.amount ?? 0) / total) * 100,
        };
      }
      return {
        ...item,
        category: category?.get(item.categoryId)?.name,
        percentage: 0,
      };
    });

    const sortedWithPercentage = withPercentage.sort((a, b) => {
      // Sort berdasarkan yang terbesar
      return b.percentage - a.percentage;
    });

    const result = {
      transactions: transactionsDate,
      byCategories: sortedWithPercentage,
      sumOfExpanses: total,
    };

    console.log(result);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transactions fetched successfully",
      data: result,
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
