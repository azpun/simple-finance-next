// app/api/transactions/route.ts

import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  CreateTransactionInputType,
  TransactionSchema,
  validateCreateTransaction,
} from "@/validations/transaction.validate";
import { NextResponse } from "next/server";

export const POST = auth(async req => {
  // const session = await auth();
  const session = req.auth;

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
  const userId = session?.user?.id as string;
  const data = (await req.json()) as CreateTransactionInputType;
  const validateData = await validateCreateTransaction(data);

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

  const normalizedCategory = validateData.data?.category?.name?.toLowerCase();

  try {
    const createTransaction = await prisma.transactions.create({
      data: {
        amount: validateData.data.amount,
        title: validateData.data.title,
        description: validateData.data.description,
        type: validateData.data.type,

        user: {
          connect: {
            id: userId,
          },
        },
        category: {
          connectOrCreate: {
            where: {
              normalizeName_userId: {
                normalizeName: normalizedCategory,
                userId: userId,
              },
            },
            create: {
              name: validateData.data.category.name,
              normalizeName: normalizedCategory,
              type: validateData.data.type,
              user: {
                connect: {
                  id: userId,
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
    return NextResponse.json(
      {
        success: true,
        status: 201,
        message: "Transaction created successfully",
        data: createTransaction,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Error creating transaction",
      },
      { status: 500 },
    );
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
    const transactions = await prisma.transactions.findMany({
      where: {
        userId: userId,
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
    console.log(transactions);

    const validate =
      await TransactionSchema.array().safeParseAsync(transactions);

    if (!validate.success) {
      console.error("Validation error:", validate.error);
      return NextResponse.json(
        {
          success: false,
          status: 500,
          message: "Error validating transactions",
          errors: validate.error.flatten(),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Transactions fetched successfully",
        data: validate.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Error fetching transactions",
      },
      { status: 500 },
    );
  }
});
