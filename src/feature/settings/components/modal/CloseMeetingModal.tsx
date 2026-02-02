import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { useUDMeeting } from "../../api/useUDMeetings";
import { sweetSuccess } from "@/shared/utill/swir";
import CancleButton from "@/shared/components/button/CancleButton";

interface Props {
  onClose:()=>void
}

function CloseMeetingModal({ onClose }: Props) {
    const { id } = useParams();
    const { mutate } = useUDMeeting();
    const navigate = useNavigate();
    const handleDelete = () => {
      
        mutate({
          op:'d',
          id:id ?? '',
        }, {
          onSuccess: () => {
            sweetSuccess('성공적으로 모임이 삭제되었습니다.')
            navigate('/mygroup',{replace:true})
          }
        })
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="text-red-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            정말 모임을 닫으시겠어요?
          </h3>
          <p className="text-sm text-gray-600">
            모임과 관련된 모든 일정, 예산, 링크가 삭제됩니다.
            <br />이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="flex gap-3">
          <CancleButton onClose={ onClose }/>
          <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={handleDelete}
          >
            모임 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
export default CloseMeetingModal