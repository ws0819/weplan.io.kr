import type { Link } from "@/feature/schdule/types/link";
import type { Point } from "../../type/map";
import { useParams } from "react-router";
import { usePostBasePoint } from "../../api/usePostBasePoint";
import { sweetSuccess } from "@/shared/utill/swir";

interface Props {
  data: Link[];
  point:Point
 
}

function BenchMarkCategory({ data, point }: Props) {

  const { id } = useParams();
  const { mutate } = usePostBasePoint()

  const handleSetPoint = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const target = e.target.value;
    const selectLink = data.find(link => link.id === target)

    if (!selectLink) return
    const newPoint: Point = {
      meetingId: id ?? "",
      latitude: selectLink.latitude,
      longitude: selectLink.longitude,
      linkId: selectLink.id,
    };
    mutate({ 
      point:newPoint
    }, {
      onSuccess: () => {
        sweetSuccess('기준점이 변경되었습니다.')
    
      }
    })
  };
  
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-semibold">기준점 설정</h2>
      <select
        id="benchmark"
        name='benchmark'
        className="w-full border border-border rounded-lg py-3 px-4"
        value={point.linkId ? point.linkId : ''}
        onChange={(e) => handleSetPoint(e)}
        aria-label="기준점을 선택해주세요."
      >
        <option value="" disabled>기준점을 설정해주세요.</option>
        {data.map((link) => (
          <option key={ link.id } id={link.id} value={link.id}>{link.title}</option>
        ))}
      </select>
      <p className="text-sm text-lightgray text-center">기준점으로부터의 거리를 계산합니다.</p>
    </div>
  );
}
export default BenchMarkCategory