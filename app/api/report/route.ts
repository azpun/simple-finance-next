import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";

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

  const userId = req.auth.user.id;
  try {
    const dataTransactionExpense = await prisma.transactions.aggregate({
      where: {
        userId: userId,
        type: "Expense",
      },
      _sum: {
        amount: true,
      },
    });

    const dataTransactionIncome = await prisma.transactions.aggregate({
      where: {
        userId: userId,
        type: "Income",
      },
      _sum: {
        amount: true,
      },
    });

    const netBalance =
      Number(dataTransactionIncome._sum.amount) -
      Number(dataTransactionExpense._sum.amount);

    const dataFormatted = {
      netBalance,
      totalExpense: Number(dataTransactionExpense._sum.amount),
      totalIncome: Number(dataTransactionIncome._sum.amount),
    };

    console.log(dataFormatted);

    return NextResponse.json({
      success: true,
      status: 200,
      data: dataFormatted,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
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
