import type { Meetings } from "@/feature/mygroup/types/group";
import { useState } from "react";

function useEditMeeting(data:Meetings) {
    const [formData, setFormData] = useState<Meetings>({
      description:data.description,
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      thumbnail: data.thumbnail ?? '',
      totalAmount:data.totalAmount
    });
  
  const setField = <K extends keyof Meetings>(key: K, value: Meetings[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]:value
    }))
  }
  return {formData,setField}
}
export default useEditMeeting