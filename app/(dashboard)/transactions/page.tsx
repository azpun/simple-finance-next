// /app/(dashboard)/transactions/page.tsx
import AddTransactionDialog from "@/components/common/AddTransactionDialog";
import TransactionContent from "./TransactionContent";

export default function Transactions() {
  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 lg:p-10">
        <header className="p-6 md:flex md:justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl">Transactions</h1>
            <p className="tracking-tight text-balance">
              Here&apos;s your transaction list
            </p>
          </div>
          <div className="hidden md:block">
            <AddTransactionDialog />
          </div>
        </header>
        <main>
          <TransactionContent />
        </main>
      </div>
    </div>
  );
}
