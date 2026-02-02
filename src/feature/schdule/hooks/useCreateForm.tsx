import { useState } from "react"
import type { Link } from "../types/link"
import { useParams } from "react-router";

function useCreateForm() {
  const { id } = useParams();
  const [form,setForm] = useState<Link>({
      meetingId: id ?? '',
      url: '',
      title: '',
      memo: '',
      rating: 5,
      category: '',
      latitude: 0,
      longitude: 0,
      images:""
  })
  
  const setField = <K extends keyof Link>(
    key: K, value:Link[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]:value
    }))
  } 
  return {form,setField}
}
export default useCreateForm