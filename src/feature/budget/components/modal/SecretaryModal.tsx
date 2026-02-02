import SecretaryModalHeader from "./SecretaryModalHeader";
import { usePostLeader } from "../../api/usePostLeader";
import useLeaderForm from "../../hooks/useLeaderForm";
import SecretaryModalChooseMember from "./SecretaryModalChooseMember";
import SecretaryModalBank from "./SecretaryModalBank";
import SecretaryModalAccount from "./SecretaryModalAccount";
import { sweetConfirm } from "@/shared/utill/swir";

interface Props{
  onClose: () =>void
}

function SecretaryModal({ onClose }: Props) {

  const {form,setField} = useLeaderForm()
  const { mutate} = usePostLeader()
  const handleSave = () => {
    sweetConfirm(
      () => {
        mutate({ form })  
      },
      "총무로 등록하시겠습니까?",
      "총무의 계좌정보는 모든 멤버에게 공개됩니다."
  )
  onClose()
  }

  return (
    <div className="fixed inset-0 flex-center p-4 bg-black/50 z-9">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-4">
        <SecretaryModalHeader onClose={onClose} />

        <form className="p-6 space-y-5">
          <SecretaryModalChooseMember form={form} setField={setField} />
          <SecretaryModalBank form={form} setField={setField} />
          <SecretaryModalAccount form={form} setField={setField} />
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-700">
              💡 총무로 등록되면 모든 멤버가 계좌 정보를 확인할 수 있어요
            </p>
          </div>
        </form>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg  hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 transition-colors"
            onClick={handleSave}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
export default SecretaryModal