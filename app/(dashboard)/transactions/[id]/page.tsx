// app/(dashboard)/transactions/[id]/page.tsx
import { auth } from "@/auth";
import { TransactionByIdClient } from "./TransactionByIdClient";
import { getTrasactionById } from "@/lib/transactions.service";

export default async function TransactionById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userid = session?.user?.id as string;
  const transactionId = (await params).id as string;

  const data = await getTrasactionById({
    id: transactionId,
    userId: userid,
  });

  if (!data) {
    return <div>Transaction not found</div>;
  }

  return <TransactionByIdClient initialData={data} />;
}
