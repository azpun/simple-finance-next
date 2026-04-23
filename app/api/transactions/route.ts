// app/api/transactions/route.ts
// import prisma from "@/lib/connectDB";
// import { CreateTransactionInputType } from "@/validations/transaction.validate";

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
