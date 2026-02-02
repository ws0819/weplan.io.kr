import { useEffect, useState } from "react";
import type { Point } from "../type/map";


function useMapCenter(point:Point) {
    const DEFAULT_CENTER = { lat: 37.5642135, lng: 127.0016985 };
    const initialCenter = point
    ? { lat: point.latitude, lng: point.longitude }
    : DEFAULT_CENTER;
  
    const [mapCenter, setMapCenter] = useState({
      position: initialCenter,
      isPanto: false,
    });
  
  
 useEffect(() => {
   if (!point) return;
   const centerChamge = () => {
    setMapCenter({
      position: { lat: point.latitude, lng: point.longitude },
      isPanto: true,
    });
   }
   centerChamge()
 }, [point?.latitude, point?.longitude]); 

  return mapCenter;
  
}
export default useMapCenter