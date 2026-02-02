import { sweetWarning, sweetEdit } from "@/shared/utill/swir";
import { useUDMeeting } from "../../api/useUDMeetings";
import type { Meetings } from "@/feature/mygroup/types/group";
import EditMeetingHeader from "../edit/EditMeetingHeader";
import EditMeetingForm from "../edit/EditMeetingForm";
import useEditMeeting from "../../hooks/useEditMeeting";
import { useParams } from "react-router";
import { usePostAmount } from "@/feature/mygroup/api/usePostAmount";

interface Props {
  onClose: () => void;
  data: Meetings;
}

function EditMeetingModal({
  onClose,
  data,
}: Props) {

  const { id } = useParams()
  const { formData, setField } = useEditMeeting(data)
  const { mutate } = useUDMeeting()
  const { mutate:AmountMutate} = usePostAmount()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      sweetWarning("모임명을 입력해주세요.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      sweetWarning("날짜를 선택해주세요.");
      return;
    }
    
    sweetEdit(() => {
      mutate({
        id : id ?? '',
        op:'u',
        fields:formData,
      }, {
        onSuccess: () => {
          AmountMutate({
            meetingId: id,
            totalAmount:formData.totalAmount
          })
          onClose()
        }
      });
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <EditMeetingHeader onClose={onClose}/>
        <EditMeetingForm
          formData={formData}
          setField={setField}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default EditMeetingModal;
