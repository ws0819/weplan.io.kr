import { FiTrash2 } from "react-icons/fi";

interface Props {
  onOpen:()=>void
}

function SettingCloseMeeting({ onOpen }: Props) {

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
      <div className="flex items-center gap-2 mb-4">
        <FiTrash2 className="text-red-600" size={20} />
        <h2 className="text-base font-semibold text-red-600">모임 닫기</h2>
      </div>

      <div className="space-y-3">
        <button
          onClick={onOpen}
          className="w-full p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition "
        >
          모임 닫기
        </button>
        <p className="text-xs text-gray-500 text-center">
          모임을 닫으면 모든 데이터가 삭제되며 복구할 수 없습니다.
        </p>
      </div>
    </section>
  );
}
export default SettingCloseMeeting