import type { Point } from "../../type/map";
import { calculateDistance } from "../../utill/calculateDistance";
import { categoryIconConverter } from "../../utill/categoryIconConverter";

interface Props{
  category: string;
  title: string
  latitude: number;
  longitude: number;
  point?: Point;
}

function BenchMarkItems({ category,title,latitude,longitude,point}:Props) {
  const icon = categoryIconConverter(category)
  const hasBasePoint = point?.latitude && point?.longitude;
  const distance = hasBasePoint ? calculateDistance(
    point.latitude,
    point.longitude,
    latitude,
    longitude
  ) : 0
  
  return (
    <div className="bg-gray-100 shadow-sm rounded-sm px-4 py-2 flex justify-between">
      <div className="flex gap-2 items-center">
        <div className="text-4xl bg-primary/10 flex-center rounded-lg w-15 h-15">
          {icon}
        </div>
        <span className="flex flex-col">
          <h3 className="font-semibold">{title}</h3>
          <p>{category}</p>
        </span>
      </div>
      <div className="flex items-end gap-1">
        <p className="text-xl font-semibold">
          {distance < 1 ? Math.round(distance * 1000) : distance}
        </p>
        <p className="text-sm text-gray-600">{distance < 1 ? "M" : "KM"}</p>
      </div>
    </div>
  );
}
export default BenchMarkItems