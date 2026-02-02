import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";



async function getMember(meetingId:string) {
  const { data } = await api.get(
    `/meetings/members/${meetingId}`
  );
  return data.meetingmembers
}

export const useGetMember = (meetingId: string) => {
  return useQuery({
    queryKey: ['member', meetingId],
    queryFn: () => getMember(meetingId),
    enabled:!!meetingId
  })
}