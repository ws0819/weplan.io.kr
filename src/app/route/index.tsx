import { Navigate, useLocation, useParams} from "react-router"
import { useGetGroupData } from "./api/useGetGroup"
import LoadingSpinner from "@/shared/components/loading/LoadingSpinner"
import MeetingLayout from "../layout/components/MeetingLayout"
import DefaultLayOut from "../layout/components/DefaultLayOut"


function Root() {
  const { id } = useParams()
  const location = useLocation()
  const isMeetingPage = location.pathname.startsWith("/meeting/");
  const { data,isLoading } = useGetGroupData(id ?? '')
  const isUser = sessionStorage.getItem('accessToken')


  if (isLoading) {
    return(
    <div className="flex-center h-full">
      <LoadingSpinner/>
    </div>
    )
  }

  if (!isUser) {
    return <Navigate to='/onboard' replace/>
  }

  if (location.pathname === "/") {
    return <Navigate to={`/mygroup`} replace />;
  }

  if (isMeetingPage && data) {
    return (
      <MeetingLayout meetingId={id} data={ data } />
    );
  }

  return <DefaultLayOut/>
}
export default Root