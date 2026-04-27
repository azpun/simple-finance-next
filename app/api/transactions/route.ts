// app/api/transactions/route.ts
"use server";
import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transactions fetched successfully",
      data: transactions,
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
