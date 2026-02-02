import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

interface Props{
  title: string;
  startDate: string;
  endDate: string;
  description?:string
}

function MeetingHeader({ title,startDate,endDate,description}:Props) {
   const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <span className="flex gap-2">
          <button type="button" onClick={() => navigate("/mygroup")}>
            <IoArrowBackOutline size={24} aria-label="뒤로가기" />
          </button>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-sm text-darkgray">{`${startDate} ~ ${endDate}`}</p>
            </span>
            <span>
              <p className="text-sm text-darkgray">{description}</p>
            </span>
          </div>
        </span>
      </div>
    </header>
  );
}
export default MeetingHeader