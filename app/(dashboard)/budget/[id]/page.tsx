// app/(dashboard)/budget/[id]/page.tsx

import BudgetByIdClient from "../_components/BudgetByIdClient";
const BudgetById = async ({ params }: { params: Promise<{ id: string }> }) => {
  const budgetId = (await params).id as string;
  return <BudgetByIdClient budgetId={budgetId} />;
};

export default BudgetById;
