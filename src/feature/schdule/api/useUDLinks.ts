import type { UpdateOrDelete } from "@/types/type";
import { useMutation, useQueryClient} from "@tanstack/react-query";

import type {  LinkCard } from "../types/link";
import { api } from "@/shared/api/axios";

async function udLink({ meeting_id, id,op,fields }: {meeting_id:string,id:string,op:UpdateOrDelete,fields?:LinkCard}) {
  const { data } = await api.post(
    `/links/ud`,
    {
      meeting_id,
      id,
      op,
      fields
    },
  );

  return data
}

export const useUDLink = () => {
  const queryClient = useQueryClient()
  return (
    useMutation({
      mutationFn: ({ meeting_id, id, op,fields }: {
        meeting_id: string;
        id:string
        op: UpdateOrDelete
        fields?:LinkCard
      }) =>
      udLink({ meeting_id, id, op,fields }),
      onSuccess: (_, variable) => {
        queryClient.invalidateQueries({
          queryKey:['link',variable.meeting_id]
        })
     } 
    })
  );
}