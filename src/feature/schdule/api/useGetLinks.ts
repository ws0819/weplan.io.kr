import { useQuery } from "@tanstack/react-query";
import type { Link } from "../types/link";
import { api } from "@/shared/api/axios";

async function getLink(meetingId:string, category?:string):Promise<Link[]> {
  const { data } = await api.get(
    `/meetings/${meetingId}/links`,
    {
      params: {
        ...(category && {category})
      },
    }
  );

  return data.links
}

export const useGetLink = (meetingId: string, category?:string) => {
  return useQuery({
    queryKey: ['link', meetingId,category],
    queryFn: () => getLink(meetingId,category ),
    enabled: !!meetingId,
    staleTime: 1000 * 60 * 5
  })
}