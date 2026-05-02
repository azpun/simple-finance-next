import { AddBudgetButton } from "./_components/AddBudgetButton";
import { BudgetContent } from "./_components/BudgetContent";

const BudgetPage = () => {
  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6 lg:p-10">
        <div className="space-y-6">
          <div id="hearder" className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold lg:text-4xl">Budget</h1>
              <p className="tracking-tight text-balance">
                Here&apos;s your budget list
              </p>
            </div>
            <div className="hidden md:block">
              <AddBudgetButton />
            </div>
          </div>
          <main id="content">
            <BudgetContent />
          </main>
          <div className="md:hidden">
            <AddBudgetButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
