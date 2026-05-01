"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export const BudgetContent = () => {
  const isMobile = useMediaQuery(1022);
  const isTabletDesktop = useMediaQuery(1024);

  return (
    <div>
      {isMobile && (
        <>
          <Card className="mx-0 md:mx-1 lg:mx-2">
            <CardHeader>
              <CardTitle>
                <div>
                  <h2>Budget </h2>
                </div>
              </CardTitle>
              <CardDescription>
                <div>
                  <p>Description</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Budget Amount and Remaining</p>
                <span>Progression bar of remaining budget</span>
              </div>
            </CardContent>
            <CardFooter>
              <div>Actions Button</div>
            </CardFooter>
          </Card>
        </>
      )}
      {!isTabletDesktop && (
        <div className="relative overflow-x-auto border rounded-md shadow-xs border-default">
          <table className="w-full text-sm text-left table-auto text-body lg:table-fixed">
            <thead className="border-b border-defult bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Progression bar
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Budget Amount and Remaining
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Actions Button
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b even:bg-secondary">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">4</td>
                <td className="px-6 py-4">5</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
