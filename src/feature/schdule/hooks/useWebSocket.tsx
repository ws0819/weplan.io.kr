import {toastAlarm } from "@/shared/utill/toast"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef} from "react"

interface Props{
  meetingId: string | undefined
}

function useWebSocket({ meetingId }: Props) {

  // 웹 소켓 연결상태 체크용 state
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken')
    const wsUrl = `wss://weplan.io.kr/ws/meetings/${meetingId}?token=${token}`

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case "MEMBER_JOINED": toastAlarm("🤗새로운 멤버가 입장하였습니다.")
          queryClient.invalidateQueries({
            queryKey: [meetingId]
          })
          break;
        case "LINK_ADDED": toastAlarm("🔗새로운 링크가 올라왔어요!")
          queryClient.invalidateQueries({
          queryKey:['link',meetingId]
        })
          break;
        case "BUDGET_ADDED": toastAlarm("💵새로운 예산 항목이 등록되었습니다!")
          queryClient.invalidateQueries({
          queryKey:['budgets',meetingId]
        })
          break;
      }
    }

    ws.onerror = (error) => {
      console.error('웹 소켓 연결 에러', error)
    }

  

    return () => ws.close()
  }, [meetingId, queryClient])
}
export default useWebSocket