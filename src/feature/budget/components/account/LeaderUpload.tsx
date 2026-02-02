import { FiUsers } from "react-icons/fi";

interface Props{
  onOpen:()=>void
}

function LeaderUpload({ onOpen}:Props) {
  return (
    <section className="text-center py-8 bg-white px-5">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiUsers size={32} className="text-gray-400" />
      </div>
      <b className="text-gray-900 mb-2">
        총무가 아직 등록되지 않았어요
      </b>
      <p className="text-sm text-gray-500 mb-6">
        총무를 등록하면 모두가 쉽게 송금할 수 있어요
      </p>
      <button
        type="button"
        className="w-full bg-primary text-white py-3 px-4 rounded-lg  hover:bg-blue-700 transition-colors"
        onClick={onOpen}
      >
        총무 등록하기
      </button>
    </section>
  );
}
export default LeaderUpload