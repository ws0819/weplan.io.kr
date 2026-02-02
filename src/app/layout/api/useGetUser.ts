import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";


async function getUser(user_id:string) {
  const { data } = await api.get(`/user/${user_id}`
  )
  return data
}
  
export const useGetUser = (user_id:string) => {
  return useQuery({
    queryKey: ['user', user_id],
    queryFn: () => getUser(user_id),
    enabled: !!user_id,
    retry: 1,
    staleTime:1000*60 *5
  })
}