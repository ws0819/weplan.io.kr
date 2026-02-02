import type { Leader } from "../../type/budget";

interface Props {
  form: Leader;
  setField: <K extends keyof Leader>(key: K, value: Leader[K]) => void;
}

function SecretaryModalAccount({ form,setField}:Props) {
  return (
    <div>
      <label
        htmlFor="account"
        className="block font-semibold text-gray-700 mb-2"
      >
        계좌번호 <span className="text-red-500">*</span>
      </label>
      <input
        id="account"
        type="text"
        value={form.acount}
        placeholder="예: 3333-01-1234567"
        className="px-2 py-3 rounded-lg border-lightgray border w-full"
        onChange={(e) => setField("acount", e.target.value)}
      />
    </div>
  );
}
export default SecretaryModalAccount