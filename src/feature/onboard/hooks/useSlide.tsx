import { useEffect, useRef, useState } from "react";
import { SLIDE_ITEM } from "../constants/slideItem";

function useSlide() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const autoplayRef = useRef<number | null>(null);

  const onSlideChange = (index:number) => {
    setCurrentSlide(index)
  }

    const startAutoPlay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDE_ITEM.length);
      }, 5000);
    };

    useEffect(() => {
      startAutoPlay();
      return () => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      };
    }, []);
  return {currentSlide,onSlideChange,startAutoPlay}
}
export default useSlide