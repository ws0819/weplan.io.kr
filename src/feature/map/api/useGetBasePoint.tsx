import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";


async function getBasePoint(meeting_id: string) {
  try {
        const { data } = await api.get(
    `/meetings/${meeting_id}/base-point`,
  );

  return data 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404 || status === 500) {
      return null
    }
    throw error
  }

}

export const useGetBasePoint = ({ meeting_id }: { meeting_id: string}) => {


 return useQuery({
   queryKey: ["point", meeting_id],
  queryFn:()=>getBasePoint(meeting_id),
   enabled: !!meeting_id, 
   staleTime:0,
   retry: false,
 });

 
}