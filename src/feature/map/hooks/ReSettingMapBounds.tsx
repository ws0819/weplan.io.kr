
import { useEffect } from "react"
import { useMap } from "react-kakao-maps-sdk"
import type { Point } from "../type/map"
import type { Link } from "@/feature/schdule/types/link";

function ReSettingMapBounds({ point, links }: {point?:Point, links:Link[]}) {

  const map = useMap()

  useEffect(() => {
    if (!point && (!links || links.length === 0)) return;
    const bounds = new kakao.maps.LatLngBounds();
   
    if (point && point.latitude && point.longitude) {
      bounds.extend(new kakao.maps.LatLng(point.latitude, point.longitude));
    }


    if (links && links.length > 0) {
      links.forEach((link) => {
        if (link.latitude && link.longitude) {
          bounds.extend(new kakao.maps.LatLng(link.latitude, link.longitude));
        }
      });
    }

    if (bounds.isEmpty()) return;

    map.setBounds(bounds);
  }, [map, point?.latitude, point?.longitude]);
  
  return null
}
export default ReSettingMapBounds