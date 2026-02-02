// 예쁜 색상 조합들
const GRADIENTS = [
  ["#FF6B9D", "#C44569"],
  ["#FFA07A", "#FF6B9D"],
  ["#98D8C8", "#6BCB77"],
  ["#6C5CE7", "#4D96FF"],
  ["#FDA7DF", "#F06292"],
  ["#FFD93D", "#FFA07A"],
];

// 랜덤으로 하나 선택
export function getRandomGradient() {
  const random = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  return { from: random[0], to: random[1] };
}

// thumbnail이 그라디언트인지 확인
export function isGradient(thumbnail: string | null | undefined) {
  return thumbnail?.startsWith("gradient:") || false;
}

// 그라디언트 문자열 만들기
export function makeGradient(from: string, to: string) {
  return `gradient:${from},${to}`;
}

// 그라디언트 파싱
export function parseGradient(thumbnail: string) {
  if (!isGradient(thumbnail)) return null;

  const colors = thumbnail.replace("gradient:", "").split(",");
  return { from: colors[0], to: colors[1] };
}
