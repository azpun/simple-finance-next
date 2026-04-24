type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type Transaction = {
  id: string;
  amount: number;
  title: string;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
};

export type { Transaction };
