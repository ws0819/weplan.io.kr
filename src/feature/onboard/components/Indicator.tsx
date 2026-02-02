import { SLIDE_ITEM } from "../constants/slideItem";

interface Props{
  currentSlide: number;
  onSlideChange: (index: number) => void
  startAutoPlay:()=>void
}

function Indicator({ currentSlide,onSlideChange,startAutoPlay}:Props) {
  return (
    <div
      className="flex justify-center gap-2 pb-6"
      role="tablist"
      aria-label="슬라이드 선택"
    >
      {SLIDE_ITEM.map((_, index) => (
        <button
          key={index}
          role="tab"
          aria-current={index === currentSlide ? "true" : "false"}
          aria-label={`${index + 1}번 째 슬라이드로 이동`}
          onClick={() => {
            onSlideChange(index);
            startAutoPlay();
          }}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentSlide ? "w-12 bg-blue-600" : "w-10 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
export default Indicator