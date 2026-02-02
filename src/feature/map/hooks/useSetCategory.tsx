import { useState } from "react";

function useSetCategory() {
    const [category, setCategory] = useState("");

  const categoryChange = (tab: string) => {
    setCategory(tab);
  };

  return {category,categoryChange}
}
export default useSetCategory