import type { LinkCard } from "@/feature/schdule/types/link";

interface Props {
  formData: LinkCard;
  setField: <K extends keyof LinkCard>(key: K, value: LinkCard[K]) => void;
}

function EditLinkMemo({ formData,setField}:Props) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-sm">메모</label>
      <textarea
        value={formData.memo}
        onChange={(e) => setField('memo',e.target.value)}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
      />
    </div>
  );
}
export default EditLinkMemo