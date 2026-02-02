import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Leader } from "../type/budget";
import { api } from "@/shared/api/axios";

async function postLeader({ form }: { form: Leader }) {
  const { data } = await api.post(
    `/meetings/budget/leader`,
    form,
  );

  return data
}

export const usePostLeader = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ form }: { form: Leader }) => postLeader({ form }),
    onSuccess: (_, variable) =>
      queryClient.invalidateQueries({
        queryKey: ["budget", "leader", variable.form.meetingId],
      }),
  });
}