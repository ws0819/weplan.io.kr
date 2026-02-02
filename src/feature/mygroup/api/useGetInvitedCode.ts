import { api } from "@/shared/api/axios";
import {  useQuery } from "@tanstack/react-query";


async function getInviteCode(meetingId:string) {
  const res = await api.post(
    `/meetings/${meetingId}/invite`,
    { meetingId },
  );
  return res.data
}

export const useGetInviteCode = (meetingId: string) => {
  return useQuery({
    queryKey:['invite',meetingId],
    queryFn: () => getInviteCode(meetingId),
    enabled:!!meetingId
  })
}