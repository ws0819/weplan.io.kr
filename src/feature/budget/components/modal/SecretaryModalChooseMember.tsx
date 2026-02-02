import type { Members } from "@/feature/mygroup/types/group";
import type { Leader } from "../../type/budget";
import { useGetMember } from "@/feature/mygroup/api/useGetMember";
import { useParams } from "react-router";
import MemberOption from "./MemberOption";


interface Props {
  form: Leader;
  setField: <K extends keyof Leader>(key: K, value: Leader[K]) => void;
}

function SecretaryModalChooseMember({ form, setField }: Props) {
  
  const { id } = useParams();
  const { data, isLoading } = useGetMember(id ?? ""); 

  if (isLoading) {
    return (
        <p>로딩 중</p>
      )
  }
  
  return (
    <div>
      <label
        htmlFor="member"
        className="block font-semibold text-gray-700 mb-2"
      >
        총무 선택 <span className="text-red-500">*</span>
      </label>
      <select
        id="member"
        value={form.userId}
        className="px-2 py-3 rounded-lg border-lightgray border w-full"
        onChange={(e) => setField("userId", e.target.value)}
      >
        <option value="" disabled>
          총무를 선택해주세요.
        </option>
        {data &&
          data.map((member: Members) => 
            (
            <MemberOption userId={member.userId} />
            ) 
          )}
      </select>
    </div>
  );
}
export default SecretaryModalChooseMember