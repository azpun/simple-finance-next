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
  const isMobile = useMediaQuery(1024);
  //   const isTabletDesktop = useMediaQuery(1024);

  console.log(isMobile);
  //   console.log(isTabletDesktop);

  return (
    <div>
      {isMobile && (
        <>
          <Card className="mx-0 md:mx-1 lg:mx-2">
            <CardHeader>
              <CardTitle>
                <div>
                  <h2>Budget Bulan Tahun</h2>
                </div>
              </CardTitle>
              <CardDescription>
                <div>
                  <p>Budget Description</p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <span>Progression bar of remaining budget</span>
                <p>Budget Amount and Remaining</p>
              </div>
            </CardContent>
            <CardFooter>
              <div>Actions Button</div>
            </CardFooter>
          </Card>
        </>
      )}
      {!isMobile && (
        <>
          <table className="w-full border">
            <thead>
              <tr>
                <th>Budget Bulan Tahun</th>
                <th>Budget Description</th>
                <th>Progression bar </th>
                <th>Budget Amount and Remaining</th>
                <th>Actions Button</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
