import { useGetGroupData } from "@/app/route/api/useGetGroup"
import { FiCalendar, FiEdit2, FiImage } from "react-icons/fi"
import { useParams } from "react-router"
import EditMeetingModal from "./modal/EditMeetingModal"
import { useState } from "react"
import { TbMoneybag } from "react-icons/tb"
import { formatNumber } from "@/shared/utill/formatNumber"

function SettingInfo() {
  const { id } = useParams()
  const { data } = useGetGroupData(id ?? '')
  const [isModalOpen,setIsModalOpen] = useState(false)

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <FiEdit2 className="text-blue-600" size={20} />
          <h2 className="text-base font-semibold">모임 정보</h2>
        </div>
        <button
          type="button"
          className="text-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          수정하기
        </button>
      </header>

      <main className="space-y-4">
        <section className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 mb-1">모임명</p>
            <p>{data?.title}</p>
          </div>
          <FiEdit2 className="text-gray-400" size={18} />
        </section>

        <section className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 mb-1">일정</p>
            <p>{`${data?.startDate} ~ ${data?.endDate}`}</p>
          </div>
          <FiCalendar className="text-gray-400" size={18} />
        </section>

        <section className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500 mb-1">총 예산</p>
            <p>{formatNumber(data?.totalAmount)}원</p>
          </div>
          <TbMoneybag className="text-gray-400" size={18} />
        </section>

        <section className="flex items-center justify-between p-4 bg-gray-50 rounded-lg overflow-x-hidden">
          <div>
            <p className="text-sm text-gray-500 mb-1">썸네일 이미지</p>
            <p className="text-sm text-gray-400">{data?.thumbnail}</p>
          </div>
          <FiImage className="text-gray-400" size={18} />
        </section>
      </main>

      {isModalOpen && data && (
        <EditMeetingModal onClose={() => setIsModalOpen(false)} data={data} />
      )}
    </section>
  );
}
export default SettingInfo