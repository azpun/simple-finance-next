// app/api/transactions/route.ts
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  CreateTransactionInputType,
  validateCreateTransaction,
} from "@/validations/transaction.validate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id as string;

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

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

  // const normalizedCategory = validateData.data?.category?.name?.toLowerCase();

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
                normalizeName: validateData.data.category.name,
                userId: userId,
              },
            },
            create: {
              name: data.category.name,
              normalizeName: validateData.data.category.name.toLowerCase(),
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
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as string;

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
      },
    });
    // console.log(transactions);

    return NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Transactions fetched successfully",
        data: transactions,
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
}
