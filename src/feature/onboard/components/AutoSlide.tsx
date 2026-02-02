
import { SLIDE_ITEM } from "../constants/slideItem";
import Slide from "./Slide";

interface Props{
  currentSlide: number
}

function AutoSlide({ currentSlide}:Props) {
  return (
    <div className="relative flex-1">
       {SLIDE_ITEM.map(({ id, title, description, icon }, index) => {
         const isActive = index === currentSlide;
         return (
           <div
             key={id}
             role="region"
             aria-roledescription="carousel"
             aria-label="WEPLAN 소개 슬라이드"
             className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
               isActive
                 ? "opacity-100 translate-x-0"
                 : index < currentSlide
                 ? "opacity-0 -translate-x-full"
                 : "opacity-0 translate-x-full"
             }`}
           >
             <Slide
               title={title}
               icon={icon}
               description={description} />
           </div>
         );
       })}
     </div>
  )
}
export default AutoSlide