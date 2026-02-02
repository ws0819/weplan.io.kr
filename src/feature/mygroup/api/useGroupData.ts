import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";



async function getGroup(userId:string){
  const res = await api
    .get(`/meetings/list/${userId}`)
  
  return res.data.meetings;
}

export const useGetGroupData = (userId:string) => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn:()=>getGroup(userId),
    staleTime: 5 * 1000,
    enabled: !!userId,
    retry:1,
  })
}