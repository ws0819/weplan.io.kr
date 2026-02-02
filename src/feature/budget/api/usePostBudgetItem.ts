import type { PostBudgetItem } from "../type/budget";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/axios";

async function postBudgetItem({ meetingId, name,amount,category }:
PostBudgetItem) {
  const { data } = await api.post(
    `/meetings/budget/items`,
    {
      meeting_id:meetingId,
      name,
      category,
      amount,
    },
  );
  return data
}

export const usePostBudgetItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params:PostBudgetItem) => postBudgetItem(params),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey:['budgets',variable.meetingId]
      })
    }
  })
}