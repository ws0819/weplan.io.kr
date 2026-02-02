import { sweetError, sweetInfo } from "@/shared/utill/swir"
import { useEffect, useState } from "react"
import { loadKakao } from "../utill/loadKakao"


function useKakaoLogin() {

  const [isKakaoLoaded,setIsKakaoLoaded] = useState(false)

  
  useEffect(() => {

   const pendingInvite = sessionStorage.getItem("pendingInvite");
    if (pendingInvite) {
      sweetInfo("서비스를 이용하기 위해 로그인을 먼저 진행해주세요!");
    }
    loadKakao()
      .then(() => {
        console.log("✅ kakao OAuth 로드 완료");
        setIsKakaoLoaded(true);
      })
      .catch((error) => {
        console.error("❌ Google OAuth 로드 실패:", error);
      });
    
  }, [])
  
  const handleKakaoLogin = async() => {
    if (!window.Kakao) {
      sweetError('카카오 로그인을 준비중입니다.')
      return
    }

     if (!isKakaoLoaded) {
      await loadKakao();
      setIsKakaoLoaded(true);
    }
    
    window.Kakao.Auth.authorize({
      redirectUri:`${window.location.origin}/auth/kakao/callback`
    })
  }

  return {handleKakaoLogin}
}
export default useKakaoLogin