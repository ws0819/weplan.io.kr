
import Sidebar from "../Sidebar";
import { Outlet } from "react-router";
import type { Meetings } from "@/feature/mygroup/types/group";
import MeetingHeader from "./MeetingHeader";
import useWebSocket from "@/feature/schdule/hooks/useWebSocket";

interface Props{
  meetingId:string
  data:Meetings
}

function MeetingLayout({ meetingId,data }:Props) {
   useWebSocket({ meetingId});
  return (
    <div className="sm:flex">
      <Sidebar />
      <main className="mobile-view page-layout mt-5 pb-16 sm:web-view sm:pb-0 xl:mt-10">
        <MeetingHeader title={data.title} startDate={data.startDate} endDate={data.endDate} description={data?.description} />
        <Outlet />
      </main>
    </div>
  );
}
export default MeetingLayout