import { TAB_MENU } from "@/feature/schdule/constant/tabMenu"
import clsx from "clsx"
import { useState } from "react"

interface Props {
  onCategoryChange: (tab: string) => void;
}

function BenchMarkNav({ onCategoryChange}:Props) {

  const [isActive, setIsActive] = useState(0)
  
  const handleChange = (tab:string,index:number) => {
    onCategoryChange(tab)
    setIsActive(index)
  }
  return (
    <nav className="flex items-center justify-between mb-6 py-2 border-b border-border">
      <div className="overflow-x-auto scroll-hidden flex-1 -mx-2 px-2">
        <ul className="flex gap-2 w-full">
          {TAB_MENU.map(({ tab, value }, index) => (
            <li key={value} className="shrink-0">
              <button
                onClick={() => handleChange(value, index)}
                className={clsx(
                  "px-4 py-2 rounded-full font-semibold transition-colors",
                  isActive === index
                    ? "bg-primary/20 text-primary border-primary border-2"
                    : "border border-border text-darkgray hover:bg-secondary/20",
                )}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
export default BenchMarkNav