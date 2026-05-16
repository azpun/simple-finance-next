// app/api/dashboard/route.ts
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  dashboardDataSchema,
  operationOfSchema,
} from "@/validations/dashboard.validation";
import { DataBudgetMapped } from "@/validations/budget.validation";

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

  const getCurrentMonthYear = () => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  const { month, year } = getCurrentMonthYear();

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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (transactionsDate.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Transactions this month not found",
        },
        { status: 404 },
      );
    }

    const lifetimeTransactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: true,
      },
    });

    if (lifetimeTransactions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Transactions not found",
        },
        { status: 404 },
      );
    }

    const lifetimeTransactionsIncome = lifetimeTransactions.filter(
      transaction => transaction.type === "Income",
    );

    const lifetimeTransactionsExpanse = lifetimeTransactions.filter(
      transaction => transaction.type === "Expense",
    );

    const lifetimeTransactionsIncomeSum = lifetimeTransactionsIncome.reduce(
      (total, transaction) => Number(total) + Number(transaction.amount),
      0,
    );

    const lifetimeTransactionsExpanseSum = lifetimeTransactionsExpanse.reduce(
      (total, transaction) => Number(total) + Number(transaction.amount),
      0,
    );

    const currentBalance =
      lifetimeTransactionsIncomeSum - lifetimeTransactionsExpanseSum;

    const transactionsExpanse = transactionsDate.filter(
      transaction => transaction.type === "Expense",
    );

    const transactionsExpanseSum = transactionsExpanse.reduce(
      (total, transaction) => Number(total) + Number(transaction.amount),
      0,
    );

    const transactionsIncome = transactionsDate.filter(
      transaction => transaction.type === "Income",
    );

    const transactionsIncomeSum = transactionsIncome.reduce(
      (total, transaction) => Number(total) + Number(transaction.amount),
      0,
    );

    const monthlyNetFlow = transactionsIncomeSum - transactionsExpanseSum;

    const transactionsData = {
      transactionsThisMonth: transactionsDate,
      transactionsExpanseSum: transactionsExpanseSum,
      transactionsIncomeSum: transactionsIncomeSum,
      monthlyNetFlow: monthlyNetFlow,
      lifetimeTransactionsIncomeSum: lifetimeTransactionsIncomeSum,
      lifetimeTransactionsExpanseSum: lifetimeTransactionsExpanseSum,
      currentBalance: currentBalance,
    };

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

    if (transactionGroupByCategories.length === 0) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Get Transactions Group By Categories this month not found",
        },
        { status: 404 },
      );
    }

    // ===========================================================
    const getBudget = await prisma.budgets.findUnique({
      where: {
        userId_year_month: {
          userId: userId,
          year: year,
          month: month,
        },
      },
      select: {
        id: true,
        totalAmount: true,
        month: true,
        year: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!getBudget) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "Budget not found",
        },
        { status: 404 },
      );
    }

    const formattedDate = new Date(
      getBudget?.year as number,
      ((getBudget?.month ?? 0) - 1) as number,
    ).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });

    const mappingBudget = {
      id: getBudget?.id,
      totalAmount: getBudget?.totalAmount,
      monthAndYear: formattedDate,
      description: getBudget?.description,
      createdAt: getBudget?.createdAt,
      updatedAt: getBudget?.updatedAt,
    };

    const validateMappingBudget = DataBudgetMapped.safeParse(mappingBudget);

    if (!validateMappingBudget.success) {
      console.error(validateMappingBudget.error);
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: validateMappingBudget.error.message,
          error: validateMappingBudget.error.flatten(),
        },
        { status: 400 },
      );
    }
    // ===========================================================

    const sumOfExpenseThisMonth = transactionGroupByCategories.reduce<number>(
      (total, item) => {
        const { _sum } = item;
        if (_sum) {
          total += _sum.amount?.toNumber() ?? 0; // Operator '+=' cannot be applied to types 'number' and 'number | Decimal'.
        }
        return total;
      },
      0,
    );

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
          percentage:
            ((_sum.amount?.toNumber() ?? 0) / sumOfExpenseThisMonth) * 100,
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

    const budgetRemaining =
      validateMappingBudget.data.totalAmount - sumOfExpenseThisMonth;

    // const percentageRemaining = (sumOfExpenseThisMonth / budgetRemaining) * 100;

    const percentageUsage =
      (sumOfExpenseThisMonth / validateMappingBudget.data.totalAmount) * 100;

    const percentageRemaining =
      (budgetRemaining / validateMappingBudget.data.totalAmount) * 100;

    const operationsOf = {
      amountOfBudgetThisMonth: validateMappingBudget.data.totalAmount,
      sumOfExpansesThisMonth: sumOfExpenseThisMonth,
      budgetRemaining: budgetRemaining,
      percentageRemaining: percentageRemaining,
      percentageUsage: percentageUsage,
    };

    const validateOperationsOf = operationOfSchema.safeParse(operationsOf);

    if (!validateOperationsOf.success) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          message: validateOperationsOf.error.message,
          error: validateOperationsOf.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = {
      transactions: transactionsData,
      byCategories: sortedWithPercentage,
      operationsOf: validateOperationsOf.data,
      budget: validateMappingBudget.data,
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
