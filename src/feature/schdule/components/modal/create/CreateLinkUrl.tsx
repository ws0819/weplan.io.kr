import type { Link } from "@/feature/schdule/types/link";

interface Props {
  form: Link;
  setField: <K extends keyof Link>(key: K, value: Link[K]) => void;
}

function CreateLinkUrl({ form,setField}:Props) {
  return (
    <div>
      <label htmlFor="url" className="block font-semibold mb-2">
        URL <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="url"
        placeholder="https://..."
        value={form.url}
        onChange={(e) => setField('url',e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
export default CreateLinkUrl