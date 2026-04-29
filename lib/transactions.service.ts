// /lib/transactions.service.ts
import { TransactionSchema } from "@/validations/transaction.validate";
import prisma from "./connectDB";

export const getTrasactionById = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  if (!userId) {
    return console.error("Unauthorized");
  }
  const transactions = await prisma.transactions.findUnique({
    where: {
      id: id,
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
  }

  return validate.data;
};
