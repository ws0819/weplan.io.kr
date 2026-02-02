import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";


async function getLeader(meeting_id: string) {
  const { data } = await api.get(
    `/meetings/budget/leader/${meeting_id}`,
  );
  
  return data.items
}

export const useGetLeader = (meeting_id: string) => {
  return useQuery({
    queryKey: ['budget', 'leader', meeting_id],
    queryFn: () => getLeader(meeting_id),
    enabled:!!meeting_id
  })
}