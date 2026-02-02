import type { Meetings } from "@/feature/mygroup/types/group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrDelete } from "@/types/type";
import { api } from "@/shared/api/axios";

async function udMeetings({ op, id, fields}: {
  id: string,
  op:UpdateOrDelete
  fields?: Meetings
}) {
  const { data } = await api.post(`/meetings/ud`, {
    id,
    op,
    fields,
  }); 

  return data
}

export const useUDMeeting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ op, id, fields }: {
  id:string,
  op:UpdateOrDelete
  fields?: Meetings
  }) => udMeetings({op,id,fields}),
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ["group",variable.id],
      });
       queryClient.invalidateQueries({
         queryKey: ["meetings"],
       });
  }
});
}