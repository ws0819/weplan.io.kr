
import type { BudgetItem } from "../type/budget";
import type { UpdateOrDelete } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/axios";

async function udBudget({ id,meeting_id,form, op }: {
  meeting_id: string
  id:string,
  form?:BudgetItem,
  op:UpdateOrDelete
}) {
  const { data } = await api.post(
    `/budget/ud`,
    {
      meeting_id,
      id,
      op,
      form,
    },
  );

  return data
}

export const useUDBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id,meeting_id,form, op }: {
      id:string
      meeting_id:string,
      form?: BudgetItem,
      op:UpdateOrDelete
    }) => udBudget({id,meeting_id,form,op})
    , onSuccess: (_,variable) => {
      queryClient.invalidateQueries({
        queryKey:['budgets',variable.meeting_id]
      })
    }
  })
}