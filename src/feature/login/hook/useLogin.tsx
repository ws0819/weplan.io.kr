import useGoogleLogin from "./useGoogleLogin"
import useKakaoLogin from "./useKakaoLogin"

function useLogin() {
  const { handleGoogleLogin} = useGoogleLogin()
  const { handleKakaoLogin} = useKakaoLogin()

  const loginHandler = {
    google: handleGoogleLogin,
    kakao:handleKakaoLogin
  }

  return {loginHandler}
}
export default useLogin