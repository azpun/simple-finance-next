import { BudgetContent } from "./_components/BudgetContent";

const BudgetPage = () => {
  return (
    <div className="min-h-auto">
      <div className="p-4 md:p-8 lg:p-12">
        <div className="space-y-6">
          <div id="hearder">
            <h1 className="text-3xl font-bold lg:text-4xl">Budget</h1>
            <p className="tracking-tight text-balance">
              Here&apos;s your budget list
            </p>
          </div>
          <div id="content">
            <BudgetContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
