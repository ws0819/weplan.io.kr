import { api } from "@/shared/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function postAmount({ meetingId, totalAmount }: {meetingId:string,totalAmount:number}) {
  const { data } = await api.post(
    `/meetings/totalAmount`,
    {
      meetingId,
      totalAmount,
    },
  );

  return data
}

export const usePostAmount = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      meetingId,
      totalAmount,
    }: {
      meetingId: string;
      totalAmount: number;
    }) => postAmount({ meetingId, totalAmount }),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
       queryKey:['group', variable.meetingId]
      })
    }
  })
}