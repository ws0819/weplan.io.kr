import LoginButton from "./components/LoginButton";
import { SOCIAL_LOGIN } from "./constant/socialLogin";
import SEO from "@/shared/components/seo/SEO";
import LoginBackButton from "./components/LoginBackButton";
import { useNavigate } from "react-router";
import useLogin from "./hook/useLogin";

function Login() {
  const navigate = useNavigate();
  const { loginHandler } = useLogin()
  
  return (
    <>
      <SEO
        title="로그인"
        description="위플랜에 가입하고 효율적으로 모임을 관리해보세요."
        keyword="모임, 여행, 계획"
      />

      <div className="py-2 flex flex-col px-4 h-screen bg-background">
        <header>
          <LoginBackButton onNavigate={() => navigate("/")} />
        </header>

        <main className="flex flex-col h-screen items-center justify-center">
          <section className="flex flex-col items-center mb-8">
              <img
                src="/logo.webp"
                alt="로고이미지"
                width={152}
                height={63}
                fetchPriority="high"
                loading="eager"
              />
            <h1>여행, 모임 계획 모두 위플랜과 함께</h1>
          </section>

          <div className="flex flex-col items-center gap-4">
            {SOCIAL_LOGIN.map(({ id,title, color, icon }) => (
              <LoginButton
                key={title}
                title={title}
                color={color}
                icon={icon}
                onClick={loginHandler[id]}
              />
            ))}

            <p className="font-light text-black/60 text-xs">
              가입 시 이용약관 및 개인정보처리방침에 동의합니다.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;
