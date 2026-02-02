
import CardThumbnail from './CardThumbnail'
import CardDate from './CardDate'
import { useGetMember } from '../../api/useGetMember';
import CardMemberImage from './CardMemberImage';

interface Props{
  meetingId: string | undefined;
  title: string
  startDate: string
  endDate: string
  thumbnail:string | null
}

function Card({ meetingId, title, startDate, endDate, thumbnail }: Props) {

  const { data,isLoading} = useGetMember(meetingId ?? '')

  if (isLoading) {
    return (
      <p>로딩중</p>
    )
  }
  return (
    <div className="rounded-2xl border-border border-[0.5px] overflow-hidden p-3 bg-white cursor-pointer duration-200 hover:shadow-xl">
      <CardThumbnail thumbnail={thumbnail} title={title} />

      <div className="p-3 lg:p-5 flex flex-col">
        <CardDate title={title} startDate={startDate} endDate={endDate} />

        <ul className="pt-3 flex -space-x-2 lg:pt-8">
          {data.length > 0 &&
            data.map(({ userId }: { userId: string }) => (
              <li
                key={userId}
                className="w-8 h-8 rounded-full overflow-hidden  border-2 border-white flex items-center justify-center"
              >
                <CardMemberImage userId={userId} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
export default Card