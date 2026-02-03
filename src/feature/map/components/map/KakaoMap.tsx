import { Map} from "react-kakao-maps-sdk"
import type { Point } from "../../type/map";
import type { Link } from "@/feature/schdule/types/link";
import { useEffect, useState } from "react";
import ReSettingMapBounds from "../../hooks/ReSettingMapBounds";
import { loadKakaoMap } from "../../utill/loadKakaoMap";
import MapLoadingSpinner from "./MapLoadingSpinner";
import DistanceMarker from "./DistanceMarker";
import useMapCenter from "../../hooks/useMapCenter";

interface Props{
  link : Link[]
  point?: Point
}

function KakaoMap({ link, point }: Props) {
  
const [isLoaded, setIsLoaded] = useState(false);
  const mapCenter = useMapCenter(point);
  
  console.log(point)

// 카카오맵 script 동적 로딩
 useEffect(() => {
   loadKakaoMap()
     .then(() => setIsLoaded(true))
     .catch(console.error);
 }, []);

  // script 붙여올때 로딩 컴포넌트
  if (!isLoaded) {
    return (
      <MapLoadingSpinner/>
    );
  }

  return (
    <Map center={mapCenter.position} isPanto={mapCenter.isPanto} style={{ width: "100%", height: "100%" }}>
      {point && (link.map(({ id, latitude, longitude }) => 
   (
        <div key={id}>
          <DistanceMarker pointLatitude={point?.latitude ?? 0} pointLongitude={point?.longitude ?? 0} latitude={latitude} longitude={longitude} />
        </div>
      )))}
      <ReSettingMapBounds point={point} links={ link } />
    </Map>
  );
}
export default KakaoMap;
