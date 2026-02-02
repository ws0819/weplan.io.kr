import clsx from "clsx";
import { TAB_MENU } from "../constant/tabMenu";
import Button from "@/shared/components/button/Button";
import { useState } from "react";

interface Props {
  onClick: () => void;
  onCategoryChange: (category: string) => void;
}

function TabNavigate({ onClick,onCategoryChange }:Props) {

  const [isActive, setIsActive] = useState(0);
  const handleCategoryChange = (tab:string,index:number) => {
    setIsActive(index)
    onCategoryChange(tab)
  }
  
  return (
    <nav className="flex items-center justify-between mb-6 py-2 border-b border-border">
      <div className="overflow-x-auto scroll-hidden flex-1 -mx-2 px-2">
        <ul className="flex gap-2 w-full">
          {TAB_MENU.map(({ tab,value}, index) => (
            <li key={value} className="shrink-0">
              <button
                onClick={()=>handleCategoryChange(value,index)}
                className={clsx(
                  "px-4 py-2 rounded-full font-semibold transition-colors",
                  isActive === index
                    ? "bg-primary/20 text-primary border-primary border-2"
                    : "border border-border text-darkgray hover:bg-secondary/20"
                )}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={onClick}
        className="hidden lg:flex-center lg:max-w-30"
      >
        + 링크 추가
      </Button>
    </nav>
  );
}
export default TabNavigate