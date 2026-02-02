import { api } from "@/shared/api/axios"
import LoadingSpinner from "@/shared/components/loading/LoadingSpinner"
import { sweetError } from "@/shared/utill/swir"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

function Invite() {
  const { token } = useParams()
  const navigate = useNavigate()
 
  useEffect(() => {
    async function joinMeeting() {
    const accessToken = sessionStorage.getItem("accessToken")
      if (!accessToken) {
      sessionStorage.setItem('pendingInvite',token || '')
        navigate(`/login`)
        return
      } 
      try {
        const { data } = await api.post('/meetings/join',
          { token },
        )
          navigate(`/meeting/${data.meetingId}/schedule`);
      }
      catch (error) {
        sweetError('모임 참여에 실패하였습니다.')
        console.log('모임참여실패',error)
        navigate(`mygroup`)
      }
    }
    
    if (token) {
      joinMeeting();
    }
  }, [token, navigate])
  
  return (
    <div className="flex-center h-screen">
      <LoadingSpinner text='모임에 참여하는 중 입니다.'/>
    </div>
  )
}

export default Invite