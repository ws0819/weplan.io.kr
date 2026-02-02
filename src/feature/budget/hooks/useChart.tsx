import { useMemo } from "react";
import type { BudgetItem } from "../type/budget";

export function useChart(data: BudgetItem[] | undefined) {

  const chartData = useMemo(() => {
    return data?.reduce(
       (acc, item) => {
         const existing = acc.find((d) => d.name === item.category);
         if (existing) {
           existing.value += item.amount;
         } else {
           acc.push({ name: item.category, value: item.amount });
         }
         return acc;
       },
       [] as { name: string; value: number }[],
     );
  },[data])
 

  // 총 합 계산
  const total = useMemo(() => {
    return chartData?.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  

  return { chartData, total };
}
