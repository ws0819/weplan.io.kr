import type { Link } from "../types/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/axios";

async function postLink({ formData, meetingId }: {formData:Link,meetingId:string}) {
  const { data } = await api.post(`/meetings/${meetingId}/links`,
    formData ,
  );

  return data
}


export const usePostLink = () => {

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      formData,
      meetingId,
    }: {
      formData: Link;
      meetingId: string;
    }) => postLink({ formData, meetingId }),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["link", variable.meetingId],
      });
    },
  });
}

