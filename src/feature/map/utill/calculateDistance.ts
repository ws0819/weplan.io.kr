export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)

  const dLat = toRad(lat2 - lat1); // 위도상 얼마나 떨어져있는지 계산
  const dLng = toRad(lng2 - lng1); // 경도가 얼마나 떨어져있는지 계산

  // Haversine공식
  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 지그 반지름 x 각도 = 실제거리

  return Math.round(distance * 10) / 10; // 소수점 1자리
}

// 라디안 변환
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km}km`;
}
