import CreateGroupForm from "./CreateGroupForm";
import { useNavigate} from "react-router";
import { useCreateMeeting } from "../../api/useCreateMeeting";
import useMeetingForm from "../../hooks/useMeetingForm";
import { makeGradient } from "../../utill/getRandomGradient";
import { initAuth } from "@/shared/store/useUserStore";
import { sweetInfo } from "@/shared/utill/swir";
import { IoClose } from "react-icons/io5";
import { usePostAmount } from "../../api/usePostAmount";

interface Props {
  onClose:()=>void
}

function CreateGroup({ onClose }: Props) {

   const navigate = useNavigate();
  const { mutate } = useCreateMeeting();
  const {mutate:budgetMutate} = usePostAmount()
   const { formData,setField,gradient } = useMeetingForm();
  const userId = initAuth()
  
    const handleSave = async () => {
     
    if (formData.title.trim() === '') {
      sweetInfo('모임 이름을 입력해주세요.')
    }

    if (!formData.startDate || !formData.endDate) {
      sweetInfo('모임 일정을 지정해주세요.')
    }

    const thumbnailValue = formData.thumbnail ? formData.thumbnail : makeGradient(gradient.from, gradient.to)
    const payload = {
        user_id:userId ?? '',
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        thumbnail: thumbnailValue,
      };
      
     mutate(
       {form: payload},
       {
         onSuccess: (data) => {
           budgetMutate({
             meetingId: data.meetingId,
             totalAmount:formData.total_amount
           })
           navigate(`/meeting/${data.meetingId}/schedule`, {
             state: {
               showWelcome: true,
             },
          })
          }
       }
     );
  };
  
  return (
    <>
      <header className="flex justify-center gap-2 px-3 py-2 border-b-[0.5px] border-lightgray relative">
        <button
          type="button"
          className="absolute top-1/2 left-0 -translate-y-1/2"
          aria-label="모임 만들기 창 닫기"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        <h1 className="text-xl font-semibold">링크 추가하기</h1>
      </header>
      <CreateGroupForm
        formData={formData}
        setField={setField}
        onSubmit={handleSave}
        gradient={gradient}
      />
    </>
  );
}
export default CreateGroup