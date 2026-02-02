import { useEffect } from "react";
import { useLocation } from "react-router";

function useWelcome() {
  const location = useLocation();
  const showWelcome = location.state?.showWelcome || false;

  useEffect(() => {
    if (showWelcome) {
      // 히스토리 정리 (뒤로가기 시 재표시 방지)
      window.history.replaceState({}, document.title);
    }
  }, [showWelcome]); 
  return {showWelcome}
}
export default useWelcome