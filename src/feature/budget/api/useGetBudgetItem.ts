import { useQuery } from "@tanstack/react-query";
import type { BudgetItem } from "../type/budget";
import { api } from "@/shared/api/axios";

export async function getBudgetItem(meetingId:string):Promise<BudgetItem[]> {
  const {data} = await api.get(
    `/meetings/${meetingId}/budget/items`,
  );

  return data.items
}

export const useGetBudgetItem = (meetingId: string) => {
  return useQuery({
    queryKey:['budgets',meetingId],
    queryFn: () => getBudgetItem(meetingId),
    enabled:!!meetingId
  })
} 