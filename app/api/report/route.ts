import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { reportDataSchema } from "@/validations/report.validation";
import { TransactionSchema } from "@/validations/transaction.validate";
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
    const listTransactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
      },
    });

    if (listTransactions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "List Transactions Not Found",
        },
        { status: 404 },
      );
    }

    const validateListTransactions =
      TransactionSchema.array().safeParse(listTransactions);

    if (!validateListTransactions.success) {
      console.error(validateListTransactions.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Invalid Data",
        },
        { status: 400 },
      );
    }

    const listTransactionsExpense = listTransactions.filter(
      transaction => transaction.type === "Expense",
    );
    const listTransactionsIncome = listTransactions.filter(
      transaction => transaction.type === "Income",
    );

    const amountTransactionExpense = await prisma.transactions.aggregate({
      where: {
        userId: userId,
        type: "Expense",
      },
      _sum: {
        amount: true,
      },
    });

    const amountTransactionIncome = await prisma.transactions.aggregate({
      where: {
        userId: userId,
        type: "Income",
      },
      _sum: {
        amount: true,
      },
    });

    if (!amountTransactionExpense || !amountTransactionIncome) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Report not found",
        },
        { status: 404 },
      );
    }

    const netBalance =
      Number(amountTransactionIncome._sum.amount) -
      Number(amountTransactionExpense._sum.amount);

    const dataFormatted = {
      listTransactionsExpense,
      listTransactionsIncome,
      totalExpense: Number(amountTransactionExpense._sum.amount),
      totalIncome: Number(amountTransactionIncome._sum.amount),
      netBalance,
    };

    const validateFormatted = reportDataSchema.safeParse(dataFormatted);

    if (!validateFormatted.success) {
      console.error(validateFormatted.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Invalid Data",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
      data: validateFormatted.data,
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
