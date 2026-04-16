// import prisma from "@/lib/connectDB";
// import { CreateTransactionInputType } from "@/validations/transaction.validate";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
  //   const data = (await req.json()) as CreateTransactionInputType;
  //   const createTransaction = await prisma.transactions.create({
  //     data: {
  //       amount: data.amount,
  //       title: data.title,
  //       description: data.description,
  //       type: data.type,
  //       category: {
  //         connect: {
  //           name: data.category.name,
  //           //   userId: data.userId,
  //         },
  //       },
  //     },
  //   });
}
