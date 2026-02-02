import { useState } from "react"
import { useParams } from "react-router"
import type { Leader } from "../type/budget"

function useLeaderForm() {
  const { id } = useParams()
  const [form, setForm] = useState<Leader>({
    meetingId: id ?? '',
    userId : '',
    bank : '',
    acount: ''
  })

  const setField = <K extends  keyof Leader>(key:K, value:Leader[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]:value
    }))
  }
  return {form,setField}
}
export default useLeaderForm