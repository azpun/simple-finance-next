import { auth } from "@/auth";
import prisma from "@/lib/connectDB";
import {
  TransactionSchema,
  updateTransactionSchema,
} from "@/validations/transaction.validate";
import { NextResponse } from "next/server";

// Route handler untuk menangani operasi CRUD pada transaksi berdasarkan ID
// Route ini akan menangani permintaan GET untuk mengambil detail transaksi berdasarkan ID
export const GET = auth(async (req, context) => {
  // context adalah parameter kedua yang berisi informasi tentang route, termasuk params
  // (biasanya digunakan untuk menangkap parameter dinamis dari URL, seperti id transaksi dalam kasus ini)
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
  const params = await context.params;
  const userId = req.auth.user.id as string;
  const transactionId = params.id;

  try {
    const transactions = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
        userId: userId,
      },
      select: {
        id: true,
        amount: true,
        title: true,
        description: true,
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
    });

    const validate = await TransactionSchema.safeParseAsync(transactions);

    if (!validate.success) {
      console.error("Validation error:", validate.error);
      return NextResponse.json(
        {
          success: false,
          status: 500,
          message: "Error validating transaction data",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transaction retrieved successfully",
      data: validate.data,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Failed to fetch transaction",
      },
      { status: 500 },
    );
  }
});

// Route handler untuk menangani operasi DELETE pada transaksi berdasarkan ID
export const DELETE = auth(async (req, context) => {
  // context adalah parameter kedua yang berisi informasi tentang route, termasuk params
  // (biasanya digunakan untuk menangkap parameter dinamis dari URL, seperti id transaksi dalam kasus ini)

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
  const params = await context.params;

  if (!params?.id) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Transaction ID is required",
      },
      { status: 400 },
    );
  }

  const userId = req.auth.user.id as string;
  const transactionId = params.id as string;

  try {
    const deletedTransaction = await prisma.transactions.delete({
      where: {
        id: transactionId,
        userId: userId,
      },
    });
    return NextResponse.json({
      success: true,
      status: 200,
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Failed to delete transaction",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export const PUT = auth(async (req, context) => {
  console.log("PUT request received");

  console.log(await context.params);
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
  const params = await context.params;

  if (!params?.id) {
    return NextResponse.json(
      {
        success: false,
        status: 400,
        message: "Transaction ID is required",
      },
      { status: 400 },
    );
  }

  const userId = req.auth.user.id as string;
  const transactionId = params.id as string;
  const data = await req.json();

  const validateData = updateTransactionSchema.safeParse(data);

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

  console.log("User ID:", userId);
  console.log("Transaction ID:", transactionId);
  console.log("Data received:", validateData.data);

  return NextResponse.json({
    success: true,
    status: 200,
    message: "PUT request received",
  });
});
