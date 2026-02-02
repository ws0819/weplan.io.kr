import type { Link } from "@/feature/schdule/types/link";

interface Props {
  form: Link;
  setField: <K extends keyof Link>(key: K, value: Link[K]) => void;
}


function CreateLinkMemo({ form,setField}:Props) {
  return (
    <div>
      <label className="block font-semibold mb-2 text-sm">메모</label>
      <textarea
        placeholder="장소에 대한 메모를 작성하세요"
        value={form.memo ?? ""}
        onChange={(e) => setField('memo',e.target.value)}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
      />
    </div>
  );
}
export default CreateLinkMemo