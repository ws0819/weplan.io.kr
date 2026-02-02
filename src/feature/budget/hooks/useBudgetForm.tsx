import { useState } from "react"
import type { BudgetItem } from "../type/budget"
import { useParams } from "react-router";

function useBudgetForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState<BudgetItem>({
      meetingId: id ?? '',
      name : '',
      amount : 0,
      category: ''
    })

  const setField = <K extends keyof BudgetItem>(key: K, value: BudgetItem[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]:value
      }))
    }
  return {formData,setField}
}
export default useBudgetForm