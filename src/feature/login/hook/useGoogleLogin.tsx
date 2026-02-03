import { sweetError, sweetInfo } from "@/shared/utill/swir";
import { useEffect, useState } from "react";
import { loadGoogle } from "../utill/loadGoogle";
import { usePostUser } from "../api/usePostUser";
import { useAuth } from "@/shared/store/useUserStore";
import { useNavigate } from "react-router";

function useGoogleLogin() {
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);
  const { mutate } = usePostUser();
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const pendingInvite = sessionStorage.getItem("pendingInvite");

    if (pendingInvite) {
      sweetInfo("서비스를 이용하기 위해 로그인을 먼저 진행해주세요!");
    }
    loadGoogle()
      .then(() => {
        setIsGoogleLoaded(true);
      })
      .catch((error) => {
        console.error("Google OAuth 로드 실패:", error);
      });
  }, []);

  const handleGoogleLogin = async () => {
    if (!window.google) {
      sweetError("Google 스크립트 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!isGoogleLoaded) {
      await loadGoogle();
      setIsGoogleLoaded(true);
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID!,
      use_fedcm_for_prompt: false,
      callback: async (response) => {
        try {
          const idToken = response.credential;
          if (!idToken) {
            sweetError("로그인에 실패했습니다. 다시 시도해주세요.");
            return;
          }

          mutate(idToken, {
            onSuccess: (data) => {
              if (!data.token) {
                sweetError("로그인에 실패했습니다. 다시 시도해주세요.");
                return;
              }
              setAuth(data.userId, data.token);
              const pendingInvite = sessionStorage.getItem("pendingInvite");

              if (pendingInvite) {
                sessionStorage.removeItem("pendingInvite");
                navigate(`/invite/${pendingInvite}`);
              } else {
                navigate(`/mygroup`);
              }
            },
          });
        } catch (error) {
          console.error("로그인 실패", error);
          sweetError(
            "로그인 처리 도중 오류가 발생하였습니다. 다시 시도해 주세요.",
          );
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  return { handleGoogleLogin };
}
export default useGoogleLogin;
