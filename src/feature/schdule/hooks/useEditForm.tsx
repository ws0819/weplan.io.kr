import { useState } from "react";
import type { LinkCard } from "../types/link";

interface Props {
  title: string;
  memo: string;
  rating: number;
  url: string;
  category: string;
}

function useEditForm({ title, memo, rating, url, category }:Props) {
  const [formData, setFormData] = useState<LinkCard>({
    title,
    memo,
    rating,
    url,
    category
  });

  const setField = <K extends keyof LinkCard>(key:K,value:LinkCard[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]:value
    }))
  }
  return {formData,setField}
}
export default useEditForm