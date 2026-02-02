import Button from "@/shared/components/button/Button";
import {  useParams } from "react-router";
import { useGetInviteCode } from "../api/useGetInvitedCode";
import { sweetError, sweetSuccess } from "@/shared/utill/swir";

interface Prop{
  onClose:()=>void
}


function WelcomePopup({ onClose }:Prop) {

  const { id } = useParams()
  const { data } = useGetInviteCode(id ?? '')

  const inviteUrl = data?.inviteUrl ? `${window.location.origin}/invite/${data.inviteUrl}` : ''

  const handleCopyLink = () => {
    if (!inviteUrl) {
      sweetError('링크를 생성하는데 실패하였습니다')
      return
    }

    navigator.clipboard.writeText(inviteUrl).then(() => {
      sweetSuccess('초대링크 복사에 성공하였습니다.');
      setTimeout(() => {
        onClose();
      },1000)
      
    }).catch(() => {
      sweetError('초대링크 복사에 실패했습니다.')
    })
  }

  return (
    <div className="bg-black/50 fixed inset-0 h-screen w-screen z-9 flex-center flex-col p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">🎉</span>
          <span className="flex flex-col items-center">
            <b>모임이 생성되었습니다.</b>
            <p className="text-sm text-black/60">친구들을 초대해 보세요</p>
          </span>
        </div>

        <div className="h-fit bg-[#ededed] py-2 px-4 rounded-lg flex-center mt-8">
          <p className="text-primary text-sm break-all">{ inviteUrl }</p>
        </div>

        <ul className="w-full flex flex-col gap-3 pt-11">
          <li>
            <Button variant="primary" size="lg" onClick={handleCopyLink}>
              링크 복사하기
            </Button>
          </li>
          <li>
            <Button variant="secondary" size="lg">
              카카오톡 공유
            </Button>
          </li>
          <li>
            <Button variant="secondary" size="lg" onClick={onClose}>
              나중에하기
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default WelcomePopup