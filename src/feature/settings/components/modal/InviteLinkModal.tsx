import { useParams } from "react-router";
import { loadInviteUrl } from "../../utill/loadInviteUrl";
import { useGetInviteCode } from "@/feature/mygroup/api/useGetInvitedCode";
import CancleButton from "@/shared/components/button/CancleButton";
import { loadKakao } from "@/feature/login/utill/loadKakao";
import { useGetGroupData } from "@/app/route/api/useGetGroup";

interface Props {
  onClose:()=>void
}

function InviteLinkModal({onClose}: Props) {
  const { id } = useParams();
  const { data } = useGetInviteCode(id ?? "");
  const { data:group} = useGetGroupData(id)
  const { inviteLink, copyInviteLink } = loadInviteUrl(data)
  
  const handleShare = async() => {
    const Kakao = await loadKakao()

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: group.title,
        imageUrl: '/logo.webp',
        description: "모임,예행 계획은 WEPLAN에서",
        link: {
          mobileWebUrl: inviteLink,
          webUrl: inviteLink,
        },
      },
    });
    onClose()
  }

  const handleCopy = () => {
    copyInviteLink()
    onClose()
  }
 
  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
     <div className="bg-white rounded-2xl p-6 w-full max-w-md">
       <h3 className="text-lg font-semibold mb-4">초대 링크 공유</h3>
   
       <div className="mb-6">
         <p className="text-sm text-gray-600 mb-3">
           이 링크를 공유하여 친구들을 모임에 초대하세요
         </p>
         <div className="flex  flex-col sm:flex-row gap-2 min-w-0">
           <input
             type="text"
             value={inviteLink}
             readOnly
             className="flex-1 px-4 py-3 bg-gray-50 rounded-lg text-sm"
           />
           <button
             onClick={handleCopy}
             className="px-4 py-3 shrink-0 bg-blue-600 text-white  truncate rounded-lg hover:bg-blue-700 transition "
           >
             복사
           </button>
         </div>
       </div>
   
       <div className="flex gap-3">
        <CancleButton onClose={onClose}/>
          <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" onClick={ handleShare}>
           카카오톡 공유
         </button>
       </div>
     </div>
   </div>
  )
}
export default InviteLinkModal