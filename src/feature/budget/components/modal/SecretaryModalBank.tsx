import { BANKS } from "../../constants/bank";
import type { Leader } from "../../type/budget";

interface Props {
  form: Leader;
  setField: <K extends keyof Leader>(key: K, value: Leader[K]) => void;
}

function SecretaryModalBank({ form,setField}:Props) {
  return (
    <div className="flex flex-col">
      <label htmlFor="bank" className="block font-semibold text-gray-700 mb-2">
        은행 <span className="text-red-500">*</span>
      </label>
      <select
        id="bank"
        value={form.bank}
        className="px-2 py-3 rounded-lg border-lightgray border"
        onChange={(e) => setField("bank", e.target.value)}
      >
        <option value="" disabled>
          은행을 선택해주세요.
        </option>
        {BANKS.map((bank) => (
          <option value={bank}>{bank}</option>
        ))}
      </select>
    </div>
  );
}
export default SecretaryModalBank