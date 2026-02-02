// feature/login/KakaoCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/shared/store/useUserStore";
import { sweetError } from "@/shared/utill/swir";
import { useKakaoUser } from "../login/api/useKakaoUser";

function KakaoCallback() {
  const navigate = useNavigate();
  const setAuth = useAuth((state) => state.setAuth);
  const { mutate } = useKakaoUser();
const hasCalledRef = useRef(false);
  useEffect(() => {
    // ✅ URL에서 code 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
      if (hasCalledRef.current) return; // ✅ 이미 실행했으면 종료
      hasCalledRef.current = true;

    if (error) {
      console.error("❌ 카카오 로그인 실패:", error);
      sweetError("카카오 로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    if (!code) {
      sweetError("인증 코드를 받지 못했습니다.");
      navigate("/login");
      return;
    }

    // ✅ 백엔드로 code 전송
    mutate(code, {
      onSuccess: (data) => {
        if (!data.token) {
          sweetError("로그인에 실패했습니다.");
          navigate("/login");
          return;
        }

        console.log("✅ 카카오 로그인 성공:", data.userId);

        // Zustand에 저장
        setAuth(data.userId, data.token);

        // 초대 링크 처리
        const pendingInvite = sessionStorage.getItem("pendingInvite");
        if (pendingInvite) {
          sessionStorage.removeItem("pendingInvite");
          navigate(`/invite/${pendingInvite}`);
        } else {
          navigate("/mygroup");
        }
      },
      onError: (error) => {
        console.error("❌ 백엔드 인증 실패:", error);
        sweetError("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      },
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default KakaoCallback;
