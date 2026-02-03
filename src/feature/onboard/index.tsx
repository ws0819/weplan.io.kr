import { useNavigate } from "react-router";
import AutoSlide from "./components/AutoSlide";
import Indicator from "./components/Indicator";
import useSlide from "./hooks/useSlide";
import SEO from "@/shared/components/seo/SEO";
import Button from "@/shared/components/button/Button";
import { useEffect } from "react";


function Onboard() {
  const navigate = useNavigate()
  const { currentSlide,onSlideChange,startAutoPlay } = useSlide()
  const isUser = sessionStorage.getItem("accessToken");

  useEffect(() => {
    if (isUser) {
      navigate("/mygroup", { replace: true });
    }
  }, [isUser, navigate]);

  return (
    <>
      <SEO
        title="WEPLAN"
        description="위플랜으로 모임을 계획하세요"
        keyword="모임, 여행, 계획"
      />
      <div className="relative h-screen overflow-hidden flex flex-col px-3 py-2">
        <h1 className="mx-auto">
          <img src="./logo.webp" alt="로고이미지" height={63} width={152} />
        </h1>
        <div className="text-center mb-6 px-4">
          <p className="text-lg text-gray-700 mb-2">
            여행과 모임 계획을 한 곳에서 관리하는 협업 서비스
          </p>
          <p className="text-sm text-gray-600">
            링크 수집, 지도 기반 거리 계산, 예산 관리를 친구들과 함께
          </p>
        </div>
        <AutoSlide currentSlide={currentSlide} />
        <Indicator
          currentSlide={currentSlide}
          onSlideChange={onSlideChange}
          startAutoPlay={startAutoPlay}
        />
        <div className="flex flex-col items-center gap-3 px-6 pb-8">
          <Button
            variant="primary"
            size="lg"
            aria-label="로그인 페이지로 이동"
            onClick={() => navigate("/login")}
          >
            로그인
          </Button>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500 mb-1">
              가입 시{" "}
              <a
                href="/terms"
                className="text-primary hover:underline font-medium"
              >
                이용약관
              </a>{" "}
              및{" "}
              <a
                href="/privacy"
                className="text-primary hover:underline font-medium"
              >
                개인정보처리방침
              </a>
              에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Onboard;
