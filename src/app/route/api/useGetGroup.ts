import type { Meetings } from "@/feature/mygroup/types/group";
import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";


async function getGroupData(meetingId:string):Promise<Meetings> {
  const res = await api.get(
    `/meetings/${meetingId}`,
  );

  return res.data
}

export const useGetGroupData = (meetingId: string) => {
  return useQuery({
    queryKey: ['group', meetingId],
    queryFn: () => getGroupData(meetingId),
    enabled:!!meetingId
  })
}