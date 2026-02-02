import { api } from "@/shared/api/axios";
import { useMutation } from "@tanstack/react-query";


async function kakaoPostUser(code: string) {
  const { data } = await api.post(
    `/auth/kakao`,
    { idToken:code },
  );

  return data;
}

export function useKakaoUser() {
  return useMutation({
    mutationFn: (idToken: string) => kakaoPostUser(idToken),
  });
}
