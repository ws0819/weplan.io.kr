
import { useEffect } from "react"
import { useMap } from "react-kakao-maps-sdk"
import type { Point } from "../type/map"

function ReSettingMapBounds({ point }: {point:Point}) {

  const map = useMap()
  const bounds = () => {
    const bounds = new kakao.maps.LatLngBounds()

    bounds.extend(new kakao.maps.LatLng(point.latitude, point.longitude))
    return bounds
  }

   useEffect(() => {
     if (point) {
       map.setBounds(bounds());
     }
   }, [map, point]);
  return null
}
export default ReSettingMapBounds