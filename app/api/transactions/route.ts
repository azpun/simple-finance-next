// app/api/transactions/route.ts

import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";
// import { toZonedTime } from "date-fns-tz";

export async function POST(req: Request) {
  const data = await req.json();
  const normalizedCategory = data.category.name.trim().toLowerCase();

  try {
    const createTransaction = await prisma.transactions.create({
      data: {
        amount: data.amount,
        title: data.title,
        description: data.description,
        type: data.type,
        user: {
          connect: {
            id: data.userId,
          },
        },
        category: {
          connectOrCreate: {
            where: {
              name_userId: {
                name: normalizedCategory,
                userId: data.userId,
              },
            },
            create: {
              name: normalizedCategory,
              user: {
                connect: {
                  id: data.userId,
                },
              },
            },
          },
        },
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json({
      success: true,
      status: 201,
      message: "Transaction created successfully",
      data: createTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error creating transaction",
      error: error,
    });
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  console.log(userId);

  // const timezone = "Asia/Jakarta";
  const nowUtc = new Date();
  const month = nowUtc.getMonth() + 1; // Months are zero-indexed
  const year = nowUtc.getFullYear();
  // const nowLocal = toZonedTime(nowUtc, timezone);

  const referenceDate = new Date(year, month - 1); // First day of the current month

  const start = startOfMonth(referenceDate);
  const end = endOfMonth(referenceDate);

  try {
    const transactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
      },
    });
    // console.log(transactions);

    const transactionsDate = await prisma.transactions.findMany({
      where: {
        userId: userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        category: true,
      },
    });

    // console.log(transactionsDate);

    const expansesTransactions = transactionsDate.filter(
      transaction => transaction.type === "EXPENSE",
    );
    const sumOfExpanses = expansesTransactions.reduce<number>(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    // console.log("Sum of expanses today:", sumOfExpanses);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transactions fetched successfully",
      data: {
        transactions: transactions,
        dailyTransactions: transactionsDate,
        sumOfExpanses: sumOfExpanses,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Error fetching transactions",
      error: error,
    });
  }
}
