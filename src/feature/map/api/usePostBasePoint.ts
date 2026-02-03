import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Point } from "../type/map";
import { api } from "@/shared/api/axios";

async function postBasePoint({ point }: {
  point: Point
}) {
  const { data } = await api.post(
    `/meetings/base-point`,
    point,
  );

  return data
}

export const usePostBasePoint = () => {
  const queryClient = useQueryClient()
 return useMutation({
   mutationFn: ({ point }: { point: Point }) => postBasePoint({ point }),
   onSuccess: (data, variables) => {
     const meetingId = variables.point.meetingId;

     queryClient.setQueryData(["point", meetingId], data);

     queryClient.invalidateQueries({
       queryKey: ["point", meetingId],
     });
   },
 });
}