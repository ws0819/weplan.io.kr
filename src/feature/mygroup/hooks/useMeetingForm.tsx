import { useState } from "react"
import type { MeetingsFormData } from "../types/group"
import { getRandomGradient } from "../utill/getRandomGradient";

function useMeetingForm() {

  const [formData, setFormData] = useState<MeetingsFormData>({
    user_id:sessionStorage.getItem('user_id') ?? '',
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    thumbnail: "",
    total_amount:0
  });
   const [gradient] = useState(() => getRandomGradient());

  const setField = <K extends keyof MeetingsFormData>(key : K, value : MeetingsFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]:value
    }))
  }
  return {formData,setField,gradient}
}
export default useMeetingForm