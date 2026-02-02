import { useMutation } from "@tanstack/react-query";
import type { MeetingsFormData } from "../types/group";
import { api } from "@/shared/api/axios";


async function createMeeting({ form }: { form: MeetingsFormData}) {
  const { data } = await api.post(
    `/meetings`,
    form
  );
  return data
}

export const useCreateMeeting = () => {
  return useMutation({
    mutationFn: ({ form }: { form: MeetingsFormData }) => createMeeting({form}),
  });
}