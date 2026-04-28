// components/common/ChartPie.tsx
"use client";

import { Label, Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  // DashboardByCategories,
  DashboardData,
  DashboardResponse,
} from "@/validations/dashboard.validation";

export function ChartPieDonut() {
  const { data: result } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard");
      const result: DashboardResponse = await response.json();
      const data: DashboardData = result.data;

      if (!result.success) {
        console.error(result);
      }
      return data;
    },
    staleTime: 0,
  });

  const mainData = React.useMemo(() => {
    const main = result?.byCategories.slice(0, 5);
    const others = result?.byCategories.slice(5);

    const otherCombine = others?.reduce(
      (acc, item) => {
        acc._sum.amount += item._sum.amount;
        acc.percentage += item.percentage;
        return acc;
      },
      {
        category: "others",
        _sum: {
          amount: 0,
        },
        percentage: 0,
      },
    );
    return (otherCombine?._sum.amount ?? 0) > 0
      ? [...(main ?? []), otherCombine]
      : main;
  }, [result?.byCategories]);

  const pieChartData = React.useMemo(() => {
    return (mainData ?? []).map((item, index) => ({
      category:
        (item?.category ?? "").charAt(0).toUpperCase() +
        item?.category.slice(1),
      percentages: Number(item?.percentage.toFixed(1)),
      value: Number(item?._sum.amount),
      fill: `var(--chart-${index + 1})`,
    }));
  }, [mainData]);

  console.log(pieChartData);

  const pieChartConfig = React.useMemo(() => {
    return (result?.byCategories ?? []).reduce(
      (acc, item, index) => {
        acc[item.category] = {
          label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          color: `var(--chart-${index + 1})`,
        };
        return acc;
      },
      {
        category: {
          label: "Category",
        },
      } as ChartConfig,
    );
  }, [result?.byCategories]) as ChartConfig;

  const sumOfExpanses = React.useMemo(() => {
    return result?.sumOfExpanses;
  }, [result?.sumOfExpanses]);
  return (
    <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={pieChartConfig}
        className="mx-auto aspect-square max-h-75"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name) => [
                  name,
                  ` Rp. ${value?.toLocaleString("id-ID")}`,
                ]}
              />
            }
          />
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="category"
            innerRadius={85}
            strokeWidth={10}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className={`${(sumOfExpanses?.toString().length ?? 0) >= 9 ? "text-xl" : "text-2xl"} font-bold fill-foreground`}
                      >
                        Rp.{sumOfExpanses?.toLocaleString("id-ID")}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Spend so far
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </CardContent>
  );
}
