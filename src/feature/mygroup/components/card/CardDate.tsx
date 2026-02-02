import { dDayCounter } from "../../utill/DdayCounter";

interface Props{
  title: string,
  startDate: string;
  endDate:string
}

function CardDate({ title, startDate, endDate }: Props) {
  
  const dDay = dDayCounter(startDate);

  return (
    <span className="flex justify-between items-center ">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="text-sm text-lightgray">{`${startDate} ~ ${endDate}`}</p>
      </div>
      <div className="rounded-sm bg-primary py-3 px-1 font-semibold text-white h-7 flex-center">
        {dDay}
      </div>
    </span>
  );
}
export default CardDate