import { api } from "@/shared/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

async function getBasePoint(meeting_id: string) {
     const { data } = await api.get(
    `/meetings/${meeting_id}/base-point`,
  );

  return data 
 
}

export const useGetBasePoint = ({ meeting_id }: { meeting_id: string}) => {
  const [is404,setIs404]  = useState(false)

 return useQuery({
   queryKey: ["point", meeting_id],
   queryFn: async () => {
     try {
       return await getBasePoint(meeting_id);
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     } catch (error: any) {
       const status = error.response?.status;
       if (status === 404 || status === 500) {
         setIs404(true);
       }
       throw error;
     }
   },
   enabled: !!meeting_id && !is404,
   staleTime:1000 * 60 * 5,
   retry: false,
 });

 
}