import { TAB_MENU } from "@/feature/schdule/constant/tabMenu";
import type { LinkCard } from "@/feature/schdule/types/link";

interface Props {
  formData: LinkCard;
  setField: <K extends keyof LinkCard>(key: K, value: LinkCard[K]) => void;
}


function EditLinkCategory({formData,setField}:Props) {
  return (
    <>
      <label className="block font-semibold mb-2 text-sm">카테고리</label>
      <select
        value={formData.category}
        onChange={(e) => setField('category',e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {TAB_MENU.map(({tab,value }) => (
            <option value={value}>{tab}</option>
          ))}
      </select>
    </>
  );
}
export default EditLinkCategory