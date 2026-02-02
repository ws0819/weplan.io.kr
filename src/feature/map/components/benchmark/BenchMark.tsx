import type {Link} from "@/feature/schdule/types/link";
import BenchMarkCategory from "./BenchMarkCategory";
import BenchMarkNav from "./BenchMarkNav";
import BenchMarkItems from "./BenchMarkItems";
import type { Point } from "../../type/map";

interface Props {
  data: Link[];
  point?: Point;
  onCategoryChange: (tab: string) => void
}

function BenchMark({ data, point,onCategoryChange}: Props) {
  
  const defaultPoint: Point = {
    meetingId: "",
    latitude: 37.5642135,
    longitude: 127.0016985,
    linkId: "",
  };
  const currentPoint = point ? point : defaultPoint;
  
  return (
    <div className="mt-5 rounded-lg md:mt-0 bg-white p-5 h-fit ">
      <BenchMarkCategory data={data} point={currentPoint} />
      <BenchMarkNav onCategoryChange={onCategoryChange} />
      <ul className="flex flex-col gap-3">
        {data.map(({ id, category, title, latitude, longitude }) => (
          <li key={id}>
            <BenchMarkItems
              category={category}
              title={title}
              latitude={latitude}
              longitude={longitude}
              point={currentPoint}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BenchMark