import { TAB_MENU } from "@/feature/schdule/constant/tabMenu";
import type { Link } from "@/feature/schdule/types/link";

interface Props {
  form: Link;
  setField: <K extends keyof Link>(key: K, value: Link[K]) => void;
}


function CreateLinkCategory({ form,setField}:Props) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-sm">
        카테고리 <span className="text-red-500">*</span>
      </label>
      <select
        value={form.category}
        onChange={(e) => setField("category", e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="" disabled>
          카테고리를 선택해주세요.
        </option>
        {TAB_MENU.map(({ tab,value}) => (
          <option value={value}>{tab}</option>
        ))}
      </select>
    </div>
  );
}
export default CreateLinkCategory