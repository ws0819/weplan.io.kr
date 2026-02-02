import { useGetMember } from "@/feature/mygroup/api/useGetMember"
import { FiLink, FiUsers } from "react-icons/fi"
import { useParams } from "react-router"
import MemberImage from "./MemberImage"

interface Props{
  onOpen:()=>void
}


function SettingMember({ onOpen }: Props) {
  
  const { id }= useParams()
  const { data } = useGetMember(id ?? '')

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FiUsers className="text-green-600" size={20} />
        <h2 className="text-base font-semibold">멤버 관리</h2>
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 mb-3">참여 중인 멤버</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">

              {data && data.map(({ userId}:{userId:string}) => (
                <MemberImage userId={ userId} />
              ))}
            </div>
            <span className="text-sm text-gray-600">총 { data?.length ?? 1}명</span>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="w-full p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2 font-semibold"
        >
          <FiLink size={18} />
          초대 링크 공유하기
        </button>
      </div>
    </section>
  );
}
export default SettingMember