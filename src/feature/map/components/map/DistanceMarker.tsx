import { CustomOverlayMap, MapMarker, Polyline } from "react-kakao-maps-sdk";
import { calculateDistance, formatDistance } from "../../utill/calculateDistance";

interface Props{
  pointLatitude: number;
  pointLongitude: number;
  latitude: number;
  longitude:number
}

function DistanceMarker({ pointLatitude,pointLongitude,latitude,longitude}:Props) {

 const distance = calculateDistance(
     pointLatitude,
     pointLongitude,
     latitude, 
     longitude
  );
  
  const midLat = ((pointLatitude) + latitude) / 2;
  const midLng = ((pointLongitude) + longitude) / 2;
  return (
    <>
      <MapMarker position={{ lat: latitude, lng: longitude }} />
      <Polyline
        path={[
          { lat: pointLatitude, lng: pointLongitude },
          { lat: latitude, lng: longitude },
        ]}
        strokeWeight={4}
        strokeColor="#FF0000"
        strokeOpacity={0.7}
        strokeStyle="dashed"
      />
      <CustomOverlayMap position={{ lat: midLat, lng: midLng }}>
        <div className="bg-white border border-red-500 rounded px-2 py-1 text-xs font-semibold shadow-md">
          {formatDistance(distance)}
        </div>
      </CustomOverlayMap>
    </>
  );
}
export default DistanceMarker