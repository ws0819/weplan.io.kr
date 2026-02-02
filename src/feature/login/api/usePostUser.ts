import { api } from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";


 async function postUser(idToken:string) {
  const { data } = await api.post(
    `/auth/google`,
    { idToken },
  );

  return data
}

export function usePostUser() {
  return useMutation({
    mutationFn: (idToken: string) => postUser(idToken),
  });
}