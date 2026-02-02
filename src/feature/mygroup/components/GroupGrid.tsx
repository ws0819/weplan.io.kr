import { Link } from "react-router";

import Card from "./card/Card";
import { initAuth } from "@/shared/store/useUserStore";
import { useGetGroupData } from "../api/useGroupData";

function GroupGrid() {

  const userId = initAuth();
  const { data } = useGetGroupData(userId!);

    if (!data || data.length === 0) {
      return (
        <div className="my-7 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 text-lg mb-2">
            아직 생성된 모임이 없습니다
          </p>
          <p className="text-gray-400 text-sm">새로운 모임을 만들어보세요!</p>
        </div>
      );
    }
  return (
    <ul className="my-7 grid grid-cols-[repeat(1,minmax(250px,1fr))] sm:grid-cols-[repeat(2,minmax(250px,1fr))]  lg:mt-10 lg:grid-cols-[repeat(3,minmax(250px,1fr))] gap-10">
      {data && data.map(({ meetingId, title,startDate,endDate,thumbnail }) => (
        <li key={ meetingId }>
          <Link to={`/meeting/${meetingId}/schedule`}>
            <Card meetingId={ meetingId} title={title} startDate={startDate} endDate={endDate} thumbnail={ thumbnail } />
          </Link>
        </li>
      )) }
    </ul>
  );
}
export default GroupGrid