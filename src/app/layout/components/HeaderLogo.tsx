import { useNavigate } from "react-router";

function HeaderLogo() {
    const navigate = useNavigate()
  
    const handleLogoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        navigate("/mygroup", { replace: true });
      } else {
        navigate("/onboard", { replace: true });
      }
  };
  
  return (
    <h1>
      <a href="/" onClick={handleLogoClick} aria-label="weplan 홈으로 이동">
        <img
          src="/logo.webp"
          alt="로고이미지"
          className="h-8 md:h-10 w-auto"
          width="152"
          height="63"
          fetchPriority="high"
          loading="eager"
        />
      </a>
    </h1>
  );
}
export default HeaderLogo